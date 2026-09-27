export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export type LanguageMode = 'auto' | 'am' | 'en';

export interface EthiopianDateInfo {
  year: number;
  month: number;
  monthNameAm: string;
  monthNameEn: string;
  day: number;
  dayNameAm: string;
  dayNameEn: string;
  isLeapYear: boolean;
  formattedAm: string;
  formattedEn: string;
  gregorianDateString: string;
}

export interface EthiopianHoliday {
  nameAm: string;
  nameEn: string;
  month: number;
  day: number;
  descriptionAm: string;
  descriptionEn: string;
}
