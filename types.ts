export interface AppData {
  id: string;
  title: string;
  developer: string;
  category: AppCategory;
  playStoreUrl: string;
  
  // Fields fetched asynchronously via API
  rating?: number;
  downloads?: string;
  description?: string;
  fullDescription?: string;
  iconUrl?: string;
  screenshots?: string[];
  featured?: boolean;
}

export enum AppCategory {
  ALL = 'الكل',
  BIBLE = 'الكتاب المقدس',
  HYMNS = 'ألحان وتسبحة',
  RADIO = 'راديو',
  SERVICES = 'خدمات'
}

export interface SearchState {
  query: string;
  results: AppData[];
}