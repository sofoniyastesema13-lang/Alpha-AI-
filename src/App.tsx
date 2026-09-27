/**
 * @license
 *  * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatSession, LanguageMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { CulturalPrompts } from './components/CulturalPrompts';
import { EthiopianCalendarWidget } from './components/EthiopianCalendarWidget';
import { AmharicKeyboardModal } from './components/AmharicKeyboardModal';
import { AboutModal } from './components/AboutModal';
import { AlphaIcon } from './components/AlphaIcon';
import { gregorianToEthiopian } from './utils/ethiopianCalendar';

const STORAGE_KEY = 'alpha_ai_chat_sessions_v1';
const CURRENT_SESSION_KEY = 'alpha_ai_current_session_id_v1';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load chat sessions:', e);
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(CURRENT_SESSION_KEY);
      if (savedId) return savedId;
    } catch (e) {
      // ignore
    }
    return '';
  });

  const [languageMode, setLanguageMode] = useState<LanguageMode>('auto');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<{ insertText: (text: string) => void } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
    } catch (e) {
      console.error('Failed to save current session ID:', e);
    }
  }, [currentSessionId]);

  // Current active session
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isStreaming]);

  // Create new session if none exists
  const createNewSession = (initialTitle: string = 'አዲስ ውይይት') => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: initialTitle,
      createdAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    return newId;
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
  };

  const handleClearAllSessions = () => {
    if (window.confirm('ሁሉንም የውይይት ታሪክ ማጥፋት ይፈልጋሉ? (Clear all chat history?)')) {
      setSessions([]);
      setCurrentSessionId('');
    }
  };

  const handleExportCurrentChat = () => {
    if (!currentMessages.length) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const ethDate = gregorianToEthiopian(new Date());

    let content = `# Alpha AI Chat Export\n`;
    content += `Title: ${currentSession?.title || 'Chat'}\n`;
    content += `Date (E.C.): ${ethDate.formattedAm}\n`;
    content += `Date (G.C.): ${new Date().toLocaleString()}\n\n---\n\n`;

    currentMessages.forEach((m) => {
      const speaker = m.role === 'assistant' ? 'Alpha AI' : 'እርስዎ (User)';
      content += `### ${speaker} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alpha_ai_chat_${dateStr}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    let targetSessionId = currentSessionId;
    if (!targetSessionId || !sessions.some((s) => s.id === targetSessionId)) {
      // Create title from first 30 chars
      const title = text.slice(0, 32).trim() + (text.length > 32 ? '...' : '');
      targetSessionId = createNewSession(title);
    }

    const userMessageId = `msg_user_${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const assistantMessageId = `msg_assistant_${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Update session title if it's the first message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === targetSessionId) {
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage
              ? text.slice(0, 32).trim() + (text.length > 32 ? '...' : '')
              : s.title,
            messages: [...s.messages, userMessage, assistantMessage],
          };
        }
        return s;
      })
    );

    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Gather past messages for context (up to last 10 messages)
      const prevMessages = (currentSession?.messages || []).slice(-10);
      const conversationHistory = [
        ...prevMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content,
        })),
        {
          role: 'user',
          content:
            languageMode === 'am'
              ? `${text}\n[ማሳሰቢያ፡ እባክዎ መልሱን ሙሉ በሙሉ በአማርኛ ቋንቋ ብቻ እና ተጠቃሚውን በአክብሮት በ"እርስዎ" በማናገር ያቅርቡ።]`
              : languageMode === 'en'
              ? `${text}\n[Note: Please reply in refined English.]`
              : text,
        },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `የአገልጋይ ስህተት ተከስቷል (${response.status})`
        );
      }

      if (!response.body) {
        throw new Error('የመልስ መረጃ አልተገኘም (No response body)');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulatedContent += parsed.text;
                // Live update message content
                setSessions((prev) =>
                  prev.map((s) => {
                    if (s.id === targetSessionId) {
                      return {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === assistantMessageId
                            ? {
                                ...m,
                                content: accumulatedContent,
                                isStreaming: true,
                              }
                            : m
                        ),
                      };
                    }
                    return s;
                  })
                );
              }
            } catch (jsonErr) {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      // Mark streaming done
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      content:
                        accumulatedContent ||
                        'መልስ ማመንጨት አልተቻለም። እባክዎ ጥያቄዎን በድጋሚ ይሞክሩ።',
                      isStreaming: false,
                    }
                  : m
              ),
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Stream aborted by user
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === targetSessionId) {
              return {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content: m.content + '\n\n*(መልስ በራስዎ ጥያቄ ተቋርጧል)*',
                        isStreaming: false,
                      }
                    : m
                ),
              };
            }
            return s;
          })
        );
      } else {
        console.error('Chat error:', err);
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === targetSessionId) {
              return {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content:
                          err.message ||
                          'ይቅርታ፣ መልስ ለማግኘት አልተቻለም። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡና ደግመው ይሞክሩ።',
                        isStreaming: false,
                        isError: true,
                      }
                    : m
                ),
              };
            }
            return s;
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...currentMessages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const ethToday = gregorianToEthiopian(new Date());

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={() => createNewSession()}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        onExportCurrentChat={handleExportCurrentChat}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header
          onNewChat={() => createNewSession()}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onOpenKeyboard={() => setIsKeyboardOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          languageMode={languageMode}
          onLanguageChange={setLanguageMode}
        />

        {/* Chat Messages Viewport */}
        <div className="flex-1 overflow-y-auto">
          {currentMessages.length === 0 ? (
            /* Empty State / Welcome Screen */
            <div className="min-h-full flex flex-col items-center justify-center p-4">
              <div className="text-center max-w-lg mx-auto mb-6">
                <div className="inline-block p-1 rounded-2xl bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-indigo-600/30 mb-4 shadow-xl">
                  <AlphaIcon size="xl" showGlow />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  እንደምን አለዎት? እኔ Alpha AI ነኝ።
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  የኢትዮጵያውያን አስተማማኝና ብልህ የጽሑፍ ረዳት። በታሪክ፣ በባህል፣ በንግድ፣ በትምህርት እና በዕለት ተዕለት ጥያቄዎች ላይ በአማርኛ እና በእንግሊዝኛ እገዛ አደርጋለሁ።
                </p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-blue-400">
                  <span>ዛሬ፡ {ethToday.formattedAm}</span>
                </div>
              </div>

              {/* Curated Prompt Starters */}
              <CulturalPrompts onSelectPrompt={handleSendMessage} />
            </div>
          ) : (
            /* Render Conversation */
            <div className="py-4">
              {currentMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onRetry={msg.isError ? handleRetry : undefined}
                />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Dock */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopStreaming={handleStopStreaming}
          isStreaming={isStreaming}
          onOpenKeyboard={() => setIsKeyboardOpen(true)}
        />
      </div>

      {/* Ethiopian Calendar Modal */}
      <EthiopianCalendarWidget
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onAskAboutHoliday={(holidayPrompt) => handleSendMessage(holidayPrompt)}
      />

      {/* Amharic Fidel Virtual Keyboard Modal */}
      <AmharicKeyboardModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInsertText={(insertedText) => {
          handleSendMessage(insertedText);
        }}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
