import { EthiopianDateInfo, EthiopianHoliday } from '../types';

export const ETHIOPIAN_MONTHS_AM = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜን',
];

export const ETHIOPIAN_MONTHS_EN = [
  'Meskerem',
  'Tikimt',
  'Hidar',
  'Tahsas',
  'Tir',
  'Yekatit',
  'Megabit',
  'Miyazya',
  'Ginbot',
  'Sene',
  'Hamle',
  'Nehase',
  'Pagume',
];

export const ETHIOPIAN_DAYS_AM = [
  'እሑድ',
  'ሰኞ',
  'ማክሰኞ',
  'ረቡዕ',
  'ሐሙስ',
  'ዓርብ',
  'ቅዳሜ',
];

export const ETHIOPIAN_DAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const ETHIOPIAN_HOLIDAYS: EthiopianHoliday[] = [
  {
    nameAm: 'እንቁጣጣሽ (የኢትዮጵያ አዲስ ዓመት)',
    nameEn: 'Enkutatash (Ethiopian New Year)',
    month: 1,
    day: 1,
    descriptionAm: 'የአዲሱ ዓመት የመጀመሪያ ቀን፤ የብርሃን እና የተስፋ በዓል',
    descriptionEn: 'The first day of the Ethiopian New Year, celebration of spring and renewal.',
  },
  {
    nameAm: 'መስቀል (የደመራ በዓል)',
    nameEn: 'Meskel (Finding of the True Cross)',
    month: 1,
    day: 17,
    descriptionAm: 'የደመራ ማብራት እና የመስቀል በዓል አከባበር',
    descriptionEn: 'Commemoration of the discovery of the True Cross, featuring the Demera bonfire.',
  },
  {
    nameAm: 'ገና (የጌታችን የኢየሱስ ክርስቶስ ልደት)',
    nameEn: 'Genna (Ethiopian Christmas)',
    month: 4,
    day: 29,
    descriptionAm: 'የገና በዓል በድምቀት የሚከበርበት ቀን',
    descriptionEn: 'Ethiopian Christmas, traditionally celebrated with midnight mass and games.',
  },
  {
    nameAm: 'ጥምቀት (የኤጲፋኒ በዓል)',
    nameEn: 'Timket (Epiphany)',
    month: 5,
    day: 11,
    descriptionAm: 'የጥምቀት በዓል የታቦታት ማደር እና የውሃ ቡራኬ ሥርዓት',
    descriptionEn: 'Celebration of the baptism of Jesus in the Jordan River with colorful processions.',
  },
  {
    nameAm: 'የአድዋ ድል በዓል',
    nameEn: 'Victory of Adwa',
    month: 6,
    day: 23,
    descriptionAm: 'ኢትዮጵያውያን የጣሊያንን ቅኝ ገዢ ኃይል ድል ያደረጉበት ታላቅ ታሪካዊ ቀን',
    descriptionEn: 'Historic victory of Ethiopian forces over the invading Italian army in 1896.',
  },
  {
    nameAm: 'የሰራተኞች ቀን',
    nameEn: 'International Workers\' Day',
    month: 8,
    day: 23,
    descriptionAm: 'ዓለም አቀፍ የሰራተኞች ቀን',
    descriptionEn: 'Celebration of workers and labor rights.',
  },
  {
    nameAm: 'የአርበኞች ቀን',
    nameEn: 'Patriots\' Victory Day',
    month: 8,
    day: 27,
    descriptionAm: 'የአምስት ዓመቱ የፋሽስት ወረራ ያበቃበትና የድል ቀን',
    descriptionEn: 'Honors the patriots who resisted the five-year Italian fascist occupation.',
  },
];

/**
 * Convert a Gregorian Date to Ethiopian Date
 */
export function gregorianToEthiopian(date: Date = new Date()): EthiopianDateInfo {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1; // 1-12
  const gDay = date.getDate();

  // Julian Day Number calculation for Gregorian date
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  const jdn =
    gDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Convert JDN to Ethiopian date
  // Ethiopian epoch JDN is 1723856
  const eraDifference = jdn - 1723856;
  const fourYearCycle = Math.floor(eraDifference / 1461);
  const remainderInCycle = eraDifference % 1461;

  let yearInCycle = Math.floor(remainderInCycle / 365);
  if (yearInCycle === 4) yearInCycle = 3;

  const ethYear = 4 * fourYearCycle + yearInCycle;
  const dayInYear = remainderInCycle - 365 * yearInCycle;

  const ethMonth = Math.floor(dayInYear / 30) + 1;
  const ethDay = (dayInYear % 30) + 1;

  const isLeap = ethYear % 4 === 3;
  const monthIdx = Math.min(Math.max(ethMonth - 1, 0), 12);
  const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)

  const monthNameAm = ETHIOPIAN_MONTHS_AM[monthIdx];
  const monthNameEn = ETHIOPIAN_MONTHS_EN[monthIdx];
  const dayNameAm = ETHIOPIAN_DAYS_AM[dayOfWeek];
  const dayNameEn = ETHIOPIAN_DAYS_EN[dayOfWeek];

  const formattedAm = `${dayNameAm}፣ ${monthNameAm} ${ethDay} ቀን ${ethYear} ዓ.ም.`;
  const formattedEn = `${dayNameEn}, ${monthNameEn} ${ethDay}, ${ethYear} E.C.`;

  const gregorianDateString = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return {
    year: ethYear,
    month: ethMonth,
    monthNameAm,
    monthNameEn,
    day: ethDay,
    dayNameAm,
    dayNameEn,
    isLeapYear: isLeap,
    formattedAm,
    formattedEn,
    gregorianDateString,
  };
}
