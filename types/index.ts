export type QuestStatus =
  | 'Active'
  | 'Pending'
  | 'Completed'
  | 'Expired'
  | 'Draft'
  | 'Archived'
  | (string & {}); // allow any Airtable single-select value without breaking types
export type FileType = 'PDF' | 'PNG' | 'JPG' | 'JPEG' | 'ZIP' | 'MD' | 'DOCX' | 'TXT' | 'OTHER';
export type Locale = 'en' | 'he';
export type Direction = 'ltr' | 'rtl';

export interface Category {
  id: string;
  name: string;
  nameHe?: string;
  color?: string;
}

export interface Quest {
  id: string;
  questNumber: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  status: QuestStatus;
  startDate?: string;
  endDate?: string;
  creatorName: string;
  assetCount: number;
  categoryIds: string[];
  categories?: Category[];
  detailsUrl?: string;
  submissionUrl?: string;
  updatedAt: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  title: string;
  titleHe?: string;
  description?: string;
  descriptionHe?: string;
  richContent?: string;
  richContentHe?: string;
  fileType: FileType;
  fileSize?: number;
  fileName: string;
  cloudinaryId: string;
  cloudinaryUrl: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  downloadCount: number;
  creatorName: string;
  questId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
}

export interface QuestListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: QuestStatus | 'all';
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'status' | 'questNumber';
  sortDir?: 'asc' | 'desc';
}
