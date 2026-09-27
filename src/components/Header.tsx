import React from 'react';
import { AlphaIcon } from './AlphaIcon';
import { MessageSquarePlus, Calendar, Keyboard, Info, Menu } from 'lucide-react';
import { LanguageMode } from '../types';

interface HeaderProps {
  onNewChat: () => void;
  onOpenCalendar: () => void;
  onOpenKeyboard: () => void;
  onOpenAbout: () => void;
  onToggleSidebar: () => void;
  languageMode: LanguageMode;
  onLanguageChange: (mode: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onOpenCalendar,
  onOpenKeyboard,
  onOpenAbout,
  onToggleSidebar,
  languageMode,
  onLanguageChange,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Zone 1: Brand Wordmark with Emblem */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg md:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <AlphaIcon size="sm" showGlow />
          <span>Alpha AI</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links (single-line text) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={onNewChat}
          className="hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          ውይይት (Chat)
        </button>
        <button
          onClick={onOpenCalendar}
          className="hover:text-blue-400 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>ቀን መቁጠሪያ (Calendar)</span>
        </button>
        <button
          onClick={onOpenKeyboard}
          className="hover:text-blue-400 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Keyboard className="w-3.5 h-3.5 text-blue-400" />
          <span>ፊደላት (Keyboard)</span>
        </button>
        <button
          onClick={onOpenAbout}
          className="hover:text-blue-400 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>ስለ እኛ (About)</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 Primary Actions (Language switcher & New Chat CTA) */}
      <div className="flex items-center gap-2.5">
        {/* Language selector toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => onLanguageChange('am')}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
              languageMode === 'am'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="አማርኛ ብቻ (Amharic)"
          >
            አማ
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
              languageMode === 'en'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('auto')}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
              languageMode === 'auto'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="ራስ-ሰር ቋንቋ ፈላጊ (Auto-Detect)"
          >
            Auto
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">አዲስ ውይይት</span>
        </button>
      </div>
    </header>
  );
};
