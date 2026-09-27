import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Keyboard, Sparkles, Info } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onStopStreaming?: () => void;
  isStreaming: boolean;
  onOpenKeyboard: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  onOpenKeyboard,
}) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [inputText]);

  const handleSend = () => {
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertQuickText = (text: string) => {
    setInputText((prev) => (prev ? `${prev} ${text}` : text));
    textareaRef.current?.focus();
  };

  // Check if input mentions image generation to show gentle text-only reminder
  const mentionsImages =
    /(?:photo|image|picture|draw|generate image|ፎቶ|ስዕል|ምስል|ሳልልኝ)/i.test(
      inputText
    );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Gentle notice if user mentions images */}
      {mentionsImages && (
        <div className="mb-2 p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            ማስታወሻ፡ Alpha AI በጽሑፍ ብቻ መረጃና ማብራሪያ የሚሰጥ ረዳት ነው። ምስሎችን ማመንጨት አይችልም። (Alpha AI provides text-only responses.)
          </span>
        </div>
      )}

      {/* Quick Phrase Bar */}
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 text-xs text-slate-400 no-scrollbar">
        <span className="shrink-0 text-[11px] text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" />
          ፈጣን ቃላት:
        </span>
        <button
          type="button"
          onClick={() => insertQuickText('ሰላም')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors shrink-0"
        >
          ሰላም
        </button>
        <button
          type="button"
          onClick={() => insertQuickText('እንደምን አለዎት?')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors shrink-0"
        >
          እንደምን አለዎት?
        </button>
        <button
          type="button"
          onClick={() => insertQuickText('በአጭሩ አስረዳኝ።')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors shrink-0"
        >
          በአጭሩ አስረዳኝ
        </button>
        <button
          type="button"
          onClick={() => insertQuickText('አመሰግናለሁ')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors shrink-0"
        >
          አመሰግናለሁ
        </button>
        <button
          type="button"
          onClick={onOpenKeyboard}
          className="px-2.5 py-1 rounded-full bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs transition-colors shrink-0 flex items-center gap-1 ml-auto"
        >
          <Keyboard className="w-3 h-3" />
          <span>የአማርኛ ኪቦርድ (Fidel)</span>
        </button>
      </div>

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ጥያቄዎን በአማርኛ ወይም በEnglish እዚህ ይጻፉ... (Ask Alpha AI in Amharic or English)"
          rows={1}
          className="w-full pl-4 pr-24 py-3.5 bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none outline-none font-sans max-h-44"
        />

        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
          {/* Virtual Keyboard Button */}
          <button
            type="button"
            onClick={onOpenKeyboard}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 rounded-xl transition-colors"
            title="የአማርኛ ፊደላት መምረጫ (Ge'ez Keyboard)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Send or Stop */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStopStreaming}
              className="p-2 text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors shadow-sm"
              title="መልሱን አቁም (Stop response)"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 rounded-xl transition-all shadow-sm flex items-center justify-center"
              title="ላክ (Send message)"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
        <span>Alpha AI · አስተማማኝና ባህላዊ እውቀት ያለው የጽሑፍ ረዳት</span>
        <span className="hidden sm:inline">Enter ይጫኑ (Shift + Enter ለአዲስ መስመር)</span>
      </div>
    </div>
  );
};
