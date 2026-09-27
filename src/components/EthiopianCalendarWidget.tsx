import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, X, ChevronRight } from 'lucide-react';
import {
  gregorianToEthiopian,
  ETHIOPIAN_HOLIDAYS,
  ETHIOPIAN_MONTHS_AM,
  ETHIOPIAN_MONTHS_EN,
} from '../utils/ethiopianCalendar';

interface EthiopianCalendarWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutHoliday?: (holidayName: string) => void;
}

export const EthiopianCalendarWidget: React.FC<EthiopianCalendarWidgetProps> = ({
  isOpen,
  onClose,
  onAskAboutHoliday,
}) => {
  const [today] = useState(() => gregorianToEthiopian(new Date()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                የኢትዮጵያ ቀን መቁጠሪያ (Ethiopian Calendar)
              </h2>
              <p className="text-xs text-slate-400">
                የዘመናት አቆጣጠር እና ታላላቅ የኢትዮጵያ በዓላት
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Today's Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/70 border border-blue-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-blue-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                የዛሬ ቀን (Today's Date)
              </span>
              <span className="text-slate-400 text-xs">
                ፈረንጆች (G.C.): {today.gregorianDateString}
              </span>
            </div>

            <div className="text-2xl font-bold text-white tracking-tight">
              {today.formattedAm}
            </div>
            <div className="text-sm text-blue-300/90 mt-1 font-medium">
              {today.formattedEn}
            </div>

            <div className="mt-4 pt-3 border-t border-blue-500/20 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">ወር (Month)</span>
                <span className="font-semibold text-slate-200">
                  {today.monthNameAm} ({today.month})
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">ቀን (Day)</span>
                <span className="font-semibold text-slate-200">{today.day}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">ዓመት (Year)</span>
                <span className="font-semibold text-slate-200">{today.year} ዓ.ም.</span>
              </div>
            </div>
          </div>

          {/* Month Overview */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>የወራት ዝርዝር (13 Months)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                12 ወራት × 30 ቀናት + ጳጉሜን (5 ወይም 6 ቀናት)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ETHIOPIAN_MONTHS_AM.map((monthAm, index) => {
                const monthNum = index + 1;
                const isCurrent = today.month === monthNum;
                return (
                  <div
                    key={monthNum}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      isCurrent
                        ? 'bg-blue-900/30 border-blue-500/50 text-white font-medium'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{monthAm}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {monthNum < 10 ? `0${monthNum}` : monthNum}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ETHIOPIAN_MONTHS_EN[index]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ethiopian Holidays */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ዋና ዋና የኢትዮጵያ በዓላት (Major Ethiopian Holidays)</span>
            </div>
            <div className="space-y-2">
              {ETHIOPIAN_HOLIDAYS.map((holiday, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between group"
                >
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-slate-200">
                      {holiday.nameAm}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {holiday.nameEn} · {ETHIOPIAN_MONTHS_AM[holiday.month - 1]} {holiday.day} ቀን
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {holiday.descriptionAm}
                    </div>
                  </div>
                  {onAskAboutHoliday && (
                    <button
                      onClick={() => {
                        onAskAboutHoliday(`ስለ ${holiday.nameAm} አከባበር፣ ታሪክ እና ባህላዊ ትርጉም በዝርዝር አስረዳኝ።`);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                    >
                      <span>ጠይቅ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            እሺ / ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
