// types/content.ts

export type ContentStatus = 'TO_WATCH' | 'WATCHING' | 'FINISHED';
export type ContentCategory = 'MOVIES' | 'SERIES' | 'ANIMES' | 'BOOKS' | 'MANGAS';
export type ContentVisibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE';

export interface CardItem {
  id: string;
  title: string;
  coverUrl?: string | null;
  rating?: number | null;
  category: ContentCategory;
  createdAt: string;
  status: ContentStatus;
  isFavorite?: boolean;
}

export interface Content {
  id: string;
  title: string;
  description?: string | null;
  category: ContentCategory;
  coverUrl?: string | null;
  visibility: ContentVisibility;
  status: ContentStatus;
  rating?: number | null;
  isFavorite?: boolean;
  startedAt?: string | null;   // ISO string from API or null
  finishedAt?: string | null;  // ISO string from API or null
  createdAt: string;           // ISO string
  updatedAt: string;           // ISO string
  ownerId?: string | null;
  // relacionamentos minimamente necessários:
  tags?: string[];
  copiedFromId?: string | null;
}

// Generic paginated result
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

/**
 * Payload enviado ao criar um conteúdo.
 * No backend alguns campos têm valor default, então eles são opcionais no DTO.
 */
export interface CreateContentDto {
  title: string;
  description?: string;
  category: ContentCategory;
  coverUrl?: string;
  visibility?: ContentVisibility; // opcional: backend default = 'PRIVATE'
  status?: ContentStatus;         // opcional: backend default = 'TO_WATCH'
  rating?: number;
  isFavorite?: boolean;
  startedAt?: string | null;      // ISO string ou null
  finishedAt?: string | null;     // ISO string ou null
  tags?: string[];
  copiedFromId?: string;
}

/**
 * Dados para atualização parcial de um conteúdo.
 * Todos os campos opcionais porque é update parcial.
 */
export interface UpdateContentDto {
  title?: string;
  description?: string;
  category?: ContentCategory;
  coverUrl?: string;
  visibility?: ContentVisibility;
  status?: ContentStatus;
  rating?: number | null;
  isFavorite?: boolean;
  startedAt?: string | null;
  finishedAt?: string | null;
  tags?: string[];
  copiedFromId?: string | null;
}

/**
 * Parâmetros para listagem/pesquisa de conteúdos.
 */
export interface GetContentsParams {
  status?: ContentStatus;
  category?: ContentCategory;
  q?: string;                     // query de busca (title/description)
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'updated';
}

/**
 * Tipagem do retorno do endpoint de criação de share link.
 */
export interface ShareLinkResponse {
  token: string;
  shareTokenId: string;
  expiresAt: string | null; // ISO string ou null
  url: string;
}
