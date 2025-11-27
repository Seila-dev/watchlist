
export type ContentStatus = 'WATCHING' | 'TO_WATCH' | 'FINISHED';
export type ContentCategory = 'MOVIES' | 'SERIES' | 'ANIMES' | 'BOOKS' | 'MANGAS';
export type ContentVisibility = 'PUBLIC' | 'PRIVATE' | 'FRIENDSONLY ';

export interface Content {
  id: string;
  title: string;
  description?: string;
  category: ContentCategory;
  coverUrl?: string;
  visibility: ContentVisibility;
  status: ContentStatus;
  rating?: number;
  isFavorite: boolean;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
}
