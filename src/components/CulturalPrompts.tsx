import React from 'react';
import { Landmark, Briefcase, GraduationCap, FileText, ChevronRight } from 'lucide-react';

interface CulturalPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

interface PromptCategory {
  titleAm: string;
  titleEn: string;
  icon: React.ReactNode;
  prompts: { am: string; en: string }[];
}

export const CulturalPrompts: React.FC<CulturalPromptsProps> = ({ onSelectPrompt }) => {
  const categories: PromptCategory[] = [
    {
      titleAm: 'ታሪክና ቅርስ',
      titleEn: 'Heritage & History',
      icon: <Landmark className="w-4 h-4 text-amber-400" />,
      prompts: [
        {
          am: 'ስለ ላሊበላ ውቅር አብያተ ክርስቲያናት አስደናቂ ታሪክ እና አሰራር በዝርዝር አስረዳኝ።',
          en: 'History and architectural wonder of Lalibela churches',
        },
        {
          am: 'የአድዋ ድል ለኢትዮጵያና ለመላው አፍሪካ ህዝቦች ያለው ታሪካዊ ፋይዳ ምንድን ነው?',
          en: 'Significance of the Battle of Adwa for Africa',
        },
        {
          am: 'የኢትዮጵያ ባህላዊ የቡና ሥነ-ሥርዓት (ቡና ማፍላት) ደረጃዎችን እና ማህበራዊ እሴቱን ግለጽልኝ።',
          en: 'Traditional Ethiopian coffee ceremony stages & cultural value',
        },
      ],
    },
    {
      titleAm: 'ንግድና ቴክኖሎጂ',
      titleEn: 'Business & Tech',
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
      prompts: [
        {
          am: 'በኢትዮጵያ ውስጥ አዲስ አነስተኛ የንግድ ሥራ (Small Business) ለመጀመር ምን ዋና ዋና ደረጃዎች ያስፈልጋሉ?',
          en: 'Steps to launch a business startup in Ethiopia',
        },
        {
          am: 'የቴሌብር (Telebirr) ዲጂታል የፋይናንስ አገልግሎት በኢትዮጵያ ንግድ ላይ ያመጣውን ለውጥ ግለጽልኝ።',
          en: 'Impact of digital payments & Telebirr in Ethiopia',
        },
        {
          am: 'በኢትዮጵያ ለሚገኙ ጀማሪ የሶፍትዌር ባለሙያዎች ምን ዓይነት የክህሎት ማጎልበቻ መንገዶች ይመከራሉ?',
          en: 'Software development roadmap for Ethiopian students',
        },
      ],
    },
    {
      titleAm: 'ትምህርትና ሳይንስ',
      titleEn: 'Education & Science',
      icon: <GraduationCap className="w-4 h-4 text-blue-400" />,
      prompts: [
        {
          am: 'ለብሔራዊ ፈተና (National Exam) ዝግጅት የሚረዱ ውጤታማ የጥናት ስልቶችን እና የጊዜ አጠቃቀም ምክሮችን ስጠኝ።',
          en: 'Effective study techniques for national exams',
        },
        {
          am: 'የአየር ንብረት ለውጥ በምሥራቅ አፍሪካ እና በኢትዮጵያ ግብርና ላይ የሚያሳድረውን ተጽዕኖ አስረዳኝ።',
          en: 'Climate impact on East African agriculture',
        },
        {
          am: 'አርቴፊሻል ኢንተለጀንስ (AI) ምን እንደሆነ እና ለወደፊት ህይወታችን ያለውን ጥቅም በቀላል አማርኛ አስረዳኝ።',
          en: 'Explain Artificial Intelligence in accessible terms',
        },
      ],
    },
    {
      titleAm: 'ጽሑፍና ቋንቋ',
      titleEn: 'Language & Writing',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      prompts: [
        {
          am: 'መደበኛ እና የተከበረ የሥራ ማመልከቻ ደብዳቤ (Cover Letter) በአማርኛ ቋንቋ አዘጋጅልኝ።',
          en: 'Formal job application letter in Amharic',
        },
        {
          am: 'የአማርኛ ቋንቋ ሰዋሰው (Grammar) መሠረታዊ ህጎችን እና የቃላት አወቃቀርን በአጭሩ አስረዳኝ።',
          en: 'Fundamentals of Amharic grammar and morphology',
        },
        {
          am: 'ይህንን እንግሊዝኛ ጽሑፍ ወደ ትክክለኛ እና ጥራት ያለው አማርኛ እንድተረጉም እርዳኝ።',
          en: 'Refined English to Amharic translation assistance',
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">
          ጠቃሚ ጥያቄዎችና መነሻ ርዕሶች
        </h3>
        <p className="text-xs text-slate-500">
          ከዚህ በታች ካሉት አማራጮች አንዱን በመጫን ውይይት ይጀምሩ ወይም የራስዎን ጥያቄ ከታች ይጻፉ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/90 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800">
              {cat.icon}
              <span className="text-xs font-semibold text-slate-200">
                {cat.titleAm}
              </span>
              <span className="text-[11px] text-slate-500">
                · {cat.titleEn}
              </span>
            </div>

            <div className="space-y-1.5">
              {cat.prompts.map((p, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => onSelectPrompt(p.am)}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/40 hover:bg-blue-600/15 hover:border-blue-500/30 border border-transparent transition-all group flex items-start justify-between gap-2"
                >
                  <span className="text-xs text-slate-300 group-hover:text-blue-200 line-clamp-2 leading-relaxed">
                    {p.am}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
