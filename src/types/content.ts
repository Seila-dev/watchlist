export type Visibility = 'PRIVATE' | 'UNLISTED' | 'PUBLIC';

export interface Content {
  id: string;
  title: string;
  description?: string;
  category: string;
  coverUrl?: string;
  visibility: Visibility;
  status: string;
  rating?: number;
  isFavorite: boolean;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
}
