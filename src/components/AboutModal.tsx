import React from 'react';
import { AlphaIcon } from './AlphaIcon';
import { X, ShieldCheck, Heart, Sparkles, MessageSquare, Globe } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <AlphaIcon size="sm" showGlow />
            <h2 className="text-sm font-semibold text-slate-100">
              ስለ Alpha AI (About Alpha AI)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 font-sans leading-relaxed">
          {/* Logo Showcase & Intro */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20">
            <AlphaIcon size="xl" showGlow className="mb-3" />
            <h3 className="text-lg font-bold text-white tracking-tight">Alpha AI</h3>
            <p className="text-xs text-blue-400 font-medium mt-0.5">
              የኢትዮጵያውያን አስተማማኝና ብልህ የጽሑፍ ረዳት
            </p>
            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              የመተግበሪያው ምልክት (Icon) የኢትዮጵያ መለያ የሆነውን የአማርኛ ፊደል <strong className="text-white">‘አ’</strong> እና የቴክኖሎጂውን ምህፃረ ቃል <strong className="text-white">‘A’</strong> (Alpha & AI) በሰማያዊ ህብረ-ቀለም ያዋሃደ ነው።
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <Globe className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">
                  ባለሁለት ቋንቋ ድጋፍ (Amharic & English)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  በአማርኛ እና በእንግሊዝኛ የተጣራ መልስ ይሰጣል፤ ተጠቃሚዎችን በአክብሮት በ«እርስዎ» መደበኛ የአነጋገር ዘይቤ ያናግራል።
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">
                  ባህላዊና ታሪካዊ ግንዛቤ (Cultural Awareness)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  የኢትዮጵያን ባህል፣ ወጎች፣ ታሪክ፣ ጂኦግራፊ እና ማህበራዊ አውዶች ከግምት ውስጥ ያስገባ ተጨባጭና ትክክለኛ መረጃ ያቀርባል።
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <MessageSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">
                  የጽሑፍ ብቻ ትኩረት (Strictly Text-Based)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  በጽሑፍ ብቻ መረጃ፣ ማብራሪያና ምክር ይሰጣል። ምስሎችን አያመነጭም፤ በምስል ምትክ ዝርዝር ማብራሪያና እርዳታ ያቀርባል።
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">
                  ትክክለኛነትና የሥነ-ምግባር ደንብ (Accuracy & Ethics)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  ያልተረጋገጠ መረጃ ከመፍጠር ይልቅ እውነታውን በግልጽ ያሳውቃል። ጎጂ ወይም አድሏዊ ይዘቶችን አይፈጥርም።
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            ተረድቻለሁ (Got it)
          </button>
        </div>
      </div>
    </div>
  );
};
