import React, { useState } from 'react';
import { Message } from '../types';
import { AlphaIcon } from './AlphaIcon';
import { Copy, Check, Volume2, VolumeX, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    // Check if Amharic or English voice is available
    const voices = window.speechSynthesis.getVoices();
    const amVoice = voices.find((v) => v.lang.startsWith('am'));
    if (amVoice) {
      utterance.voice = amVoice;
      utterance.lang = 'am-ET';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Simple Markdown renderer
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="my-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto"
            >
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h4
            key={index}
            className="text-sm font-bold text-slate-100 mt-3 mb-1.5"
          >
            {formatInlineText(line.replace('### ', ''))}
          </h4>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3
            key={index}
            className="text-base font-bold text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-800/80"
          >
            {formatInlineText(line.replace('## ', ''))}
          </h3>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h2
            key={index}
            className="text-lg font-bold text-blue-400 mt-4 mb-2 pb-1 border-b border-slate-800"
          >
            {formatInlineText(line.replace('# ', ''))}
          </h2>
        );
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        // Bullet point
        elements.push(
          <li key={index} className="ml-4 list-disc text-slate-200 my-1 leading-relaxed">
            {formatInlineText(line.substring(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        // Numbered list
        const match = line.match(/^(\d+\.)\s(.*)/);
        if (match) {
          elements.push(
            <div key={index} className="flex items-start gap-2 my-1.5 leading-relaxed">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-0.5">
                {match[1]}
              </span>
              <span className="text-slate-200">{formatInlineText(match[2])}</span>
            </div>
          );
        }
      } else if (line.startsWith('> ')) {
        // Blockquote
        elements.push(
          <blockquote
            key={index}
            className="pl-3.5 my-2 border-l-2 border-blue-500 text-slate-300 italic text-sm"
          >
            {formatInlineText(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="my-1.5 leading-relaxed text-slate-200">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <pre
          key="code-unclosed"
          className="my-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto"
        >
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  // Helper for bold and code snippets inside line
  const formatInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-blue-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`group w-full py-4 px-4 transition-colors ${
        isAssistant
          ? 'bg-slate-900/40 border-y border-slate-800/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        {isAssistant ? (
          <div className="shrink-0 mt-0.5">
            <AlphaIcon size="sm" showGlow={message.isStreaming} />
          </div>
        ) : (
          <div className="shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center text-xs font-semibold text-slate-200 shadow-sm">
            እርስዎ
          </div>
        )}

        {/* Message Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">
                {isAssistant ? 'Alpha AI' : 'እርስዎ (User)'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Actions for assistant messages */}
            {isAssistant && !message.isStreaming && !message.isError && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleSpeak}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                  title={isSpeaking ? 'ድምፅ አቁም (Stop Speech)' : 'ድምፅ አሰማ (Read Aloud)'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                  title="ጽሑፍ ቅዳ (Copy text)"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-sm font-normal text-slate-200 leading-relaxed font-sans">
            {message.isError ? (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{message.content}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-2 text-xs font-semibold underline text-red-200 hover:text-white"
                    >
                      ደግመው ይሞክሩ (Retry)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {renderFormattedContent(message.content)}
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
