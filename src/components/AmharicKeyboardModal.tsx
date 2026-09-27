import React, { useState } from 'react';
import { X, CornerDownLeft, Sparkles, Delete, Type } from 'lucide-react';

interface AmharicKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string) => void;
}

// Basic fidel families with their 7 orders: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th]
const FIDEL_FAMILIES = [
  ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'],
  ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ'],
  ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ'],
  ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ'],
  ['ሠ', 'ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ'],
  ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ'],
  ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'],
  ['ሸ', 'ሹ', 'ሺ', 'ሻ', 'ሼ', 'ሽ', 'ሾ'],
  ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ'],
  ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ'],
  ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ'],
  ['ቸ', 'ቹ', 'ቺ', 'ቻ', 'ቼ', 'ች', 'ቾ'],
  ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ'],
  ['ኘ', 'ኙ', 'ኚ', 'ኛ', 'ኜ', 'ኝ', 'ኞ'],
  ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ'],
  ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ'],
  ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ'],
  ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ'],
  ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ'],
  ['ዠ', 'ዡ', 'ዢ', 'ዣ', 'ዤ', 'ዥ', 'ዦ'],
  ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ'],
  ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ'],
  ['ጀ', 'ጁ', 'ጂ', 'ጃ', 'ጄ', 'ጅ', 'ጆ'],
  ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ'],
  ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ'],
  ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ'],
  ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ'],
  ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ'],
  ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ'],
  ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ'],
];

const COMMON_PHRASES = [
  { am: 'ሰላም', en: 'Hello' },
  { am: 'እንደምን አለዎት?', en: 'How are you? (respectful)' },
  { am: 'አመሰግናለሁ', en: 'Thank you' },
  { am: 'እባክዎ', en: 'Please (respectful)' },
  { am: 'ምን ማለት ነው?', en: 'What does it mean?' },
  { am: 'በዝርዝር አስረዳኝ', en: 'Explain in detail' },
  { am: 'ቴሌብር', en: 'Telebirr' },
  { am: 'ኢትዮጵያ', en: 'Ethiopia' },
  { am: 'አዲስ አበባ', en: 'Addis Ababa' },
  { am: 'የኢትዮጵያ ታሪክ', en: 'Ethiopian History' },
  { am: 'የቡና ሥነ-ሥርዓት', en: 'Coffee Ceremony' },
  { am: 'አድዋ', en: 'Adwa' },
];

export const AmharicKeyboardModal: React.FC<AmharicKeyboardModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<string[] | null>(FIDEL_FAMILIES[14]); // 'አ' default
  const [composedText, setComposedText] = useState('');
  const [quickInput, setQuickInput] = useState('');

  if (!isOpen) return null;

  const handleAppend = (char: string) => {
    setComposedText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setComposedText((prev) => prev.slice(0, -1));
  };

  const handleSendToChat = () => {
    if (composedText.trim()) {
      onInsertText(composedText);
      setComposedText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                የአማርኛ ፊደል ረዳት (Amharic Fidel & Keyboard)
              </h2>
              <p className="text-xs text-slate-400">
                ፊደላትን በመጫን ጽሑፍ ያዘጋጁ ወይም የተለመዱ ቃላትን በፍጥነት ይምረጡ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Composer View */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-h-[48px] px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-base text-slate-100 font-sans break-all focus-within:border-blue-500 flex items-center">
              {composedText ? (
                <span>{composedText}</span>
              ) : (
                <span className="text-slate-500 text-sm italic">
                  የተመረጡ ፊደላት እዚህ ይታያሉ (Composed text appears here)...
                </span>
              )}
            </div>
            <button
              onClick={handleBackspace}
              disabled={!composedText}
              className="p-3 text-slate-400 hover:text-red-400 disabled:opacity-40 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
              title="ፊደል ሰርዝ (Backspace)"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAppend(' ')}
              className="px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors whitespace-nowrap"
            >
              ክፍተት (Space)
            </button>
            <button
              onClick={handleSendToChat}
              disabled={!composedText.trim()}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
            >
              <span>ወደ ጥያቄ አስገባ</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Quick Phrases */}
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>የተለመዱ ቃላትና ጥያቄዎች (Quick Phrases)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleAppend(phrase.am + ' ');
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/40 border border-slate-700/60 text-slate-200 transition-all text-left"
                  title={phrase.en}
                >
                  <span className="font-medium">{phrase.am}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Family Orders (7 orders: ግዕዝ፣ ካዕብ፣ ሣልስ፣ ራብዕ፣ ኃምስ፣ ሳድስ፣ ሳብዕ) */}
          {selectedFamily && (
            <div className="p-3 bg-slate-800/60 rounded-xl border border-blue-500/30">
              <div className="text-xs text-blue-400 font-medium mb-2">
                የተመረጠው ፊደል ሰባቱ ቅርጾች (7 Orders of {selectedFamily[0]}):
              </div>
              <div className="grid grid-cols-7 gap-2">
                {selectedFamily.map((char, index) => {
                  const orderNames = ['1ኛ', '2ኛ', '3ኛ', '4ኛ', '5ኛ', '6ኛ', '7ኛ'];
                  return (
                    <button
                      key={index}
                      onClick={() => handleAppend(char)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white border border-slate-700 hover:border-blue-400 transition-all group"
                    >
                      <span className="text-lg font-bold text-slate-100 group-hover:text-white">
                        {char}
                      </span>
                      <span className="text-[10px] text-slate-500 group-hover:text-blue-200">
                        {orderNames[index]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fidel Primary Grid */}
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">
              ዋና ፊደላት (ይምረጡ) - Primary Letters:
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              {FIDEL_FAMILIES.map((family, idx) => {
                const isSelected = selectedFamily?.[0] === family[0];
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedFamily(family);
                      handleAppend(family[0]);
                    }}
                    className={`py-2 px-1 text-center rounded-lg text-base font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 border-slate-700/60'
                    }`}
                  >
                    {family[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>ጠቃሚ ምክር፡ ፊደልን ሲጫኑ 7ቱ ቅርጾች ከላይ ይወጣሉ</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
