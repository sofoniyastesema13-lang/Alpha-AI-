import React from 'react';
import { ChatSession } from '../types';
import {
  MessageSquare,
  Plus,
  Trash2,
  Calendar,
  X,
  Download,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { gregorianToEthiopian } from '../utils/ethiopianCalendar';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
  onExportCurrentChat: () => void;
  onOpenCalendar: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAllSessions,
  onExportCurrentChat,
  onOpenCalendar,
  isOpen,
  onClose,
}) => {
  const ethDate = gregorianToEthiopian(new Date());

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top actions */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>አዲስ ውይይት (New Chat)</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg md:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ethiopian Calendar Quick Tile */}
        <div className="p-3 border-b border-slate-800/60">
          <div
            onClick={onOpenCalendar}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] text-blue-400 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                የዛሬ ቀን (Today)
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-blue-300">
                ተመልከት &rarr;
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {ethDate.formattedAm}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              {ethDate.formattedEn}
            </div>
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            የቀደሙ ውይይቶች (Chat History)
          </div>

          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-600 italic">
              እስካሁን ምንም ውይይት የለም (No chat sessions yet)
            </div>
          ) : (
            sessions.map((session) => {
              const isSelected = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium border border-slate-800'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-blue-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{session.title || 'ውይይት'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-opacity"
                    title="ሰርዝ (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Utility Menu */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-1.5">
          <button
            onClick={onExportCurrentChat}
            className="w-full px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ውይይቱን በፋይል አውርድ (Export Chat)</span>
          </button>

          {sessions.length > 0 && (
            <button
              onClick={onClearAllSessions}
              className="w-full px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-950/20 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ሁሉንም ታሪክ ሰርዝ (Clear All)</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-600 px-1">
            <span>Alpha AI v1.0</span>
            <span className="text-blue-500/80">Ethiopian Edition</span>
          </div>
        </div>
      </aside>
    </>
  );
};
