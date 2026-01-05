'use client';

import { useState, useCallback, useRef } from 'react';
import { useApi } from './useApi';
import ContentService from '@/services/ContentService';
import { 
  Content, 
  ContentStatus, 
  CreateContentDto, 
  UpdateContentDto,
  GetContentsParams,
  ContentVisibility
} from '@/types/content';

interface UseContentsReturn {
  contents: Content[];
  currentContent: Content | null; // ADICIONADO
  loading: boolean;
  error: string | null;
  
  // Métodos principais
  fetchContents: (params?: GetContentsParams) => Promise<void>;
  fetchContentsByCategory: (category: string, params?: Omit<GetContentsParams, 'category'>) => Promise<void>;
  fetchContentById: (id: string) => Promise<Content | null>;
  createContent: (data: CreateContentDto) => Promise<Content | null>;
  updateContent: (id: string, data: UpdateContentDto) => Promise<Content | null>;
  updateStatus: (id: string, status: ContentStatus) => Promise<Content | null>;
  updateVisibility: (id: string, visibility: ContentVisibility) => Promise<Content | null>;
  deleteContent: (id: string) => Promise<boolean>;
  
  // Métodos auxiliares
  clearError: () => void;
  clearCurrentContent: () => void; // ADICIONADO
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;

  homeSliders: {
    watching: Content[];
    toWatch: Content[];
    finished: Content[];
  } | null;
  fetchHomeContents: (params?: { limit?: number; category?: string }) => Promise<void>;
}

// alterar futuramente

// src/mocks/contents.mock.ts
const mockContents: Record<string, any> = {
  "1": {
    id: "1",
    title: "Conteúdo Mockado",
    category: "Filme",
    status: "Publicado",
    visibility: "Público",
    rating: 9,
    description: "Esse conteúdo vem de um mock local.",
    coverUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
  }
};


// src/lib/contentCache.ts
const cache = new Map<string, any>();

const getCachedContent = (id: string) => cache.get(id);
const setCachedContent = (id: string, data: any) => {
  cache.set(id, data);
};

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  process.env.NODE_ENV === "development";

export default function useContents(): UseContentsReturn {
  const api = useApi();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
    const [homeSliders, setHomeSliders] = useState<{
    watching: Content[];
    toWatch: Content[];
    finished: Content[];
  } | null>(null);

  const snapshotRef = useRef<Content[] | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentContent = useCallback(() => {
    setCurrentContent(null);
  }, []);

  const fetchContents = useCallback(async (params?: GetContentsParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ContentService.getContents(api, params);
      // console.log('Conteúdos buscados:', response.data);
          setContents(prev => {
      if (!params?.page || params.page === 1) {
        return response.data || [];
      }
      return [...prev, ...(response.data || [])];
    });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao buscar conteúdos';
      setError(errorMsg);
      console.error('Erro ao buscar conteúdos:', err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchHomeContents = useCallback(async (params?: { limit?: number; category?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ContentService.getHomeContents(api, params);
      setHomeSliders(response.sliders);
      
      // Opcional: atualizar contents com todos os itens
      const allContents = [
        ...response.sliders.watching,
        ...response.sliders.toWatch,
        ...response.sliders.finished,
      ];
      setContents(allContents);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao buscar conteúdos da home';
      setError(errorMsg);
      console.error('Erro ao buscar home contents:', err);
    } finally {
      setLoading(false);
    }
  }, [api]);


  const fetchContentsByCategory = useCallback(async (
    category: string, 
    params?: Omit<GetContentsParams, 'category'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ContentService.getContentsByCategory(api, category, params);
      setContents(response.data || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao buscar conteúdos por categoria';
      setError(errorMsg);
      console.error('Erro ao buscar conteúdos por categoria:', err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchContentById = useCallback(
    async (id: string): Promise<Content | null> => {
      if (!id) {
        setCurrentContent(null);
        return null;
      }

      setLoading(true);
      setError(null);

      const cached = getCachedContent(id);
if (cached) {
  console.log("🔥 CACHE HIT", id);
  setCurrentContent(cached);
  setLoading(false);
  return cached;
}

  // 2️⃣ Mock
if (USE_MOCK && mockContents[id]) {
  setCachedContent(id, mockContents[id]);
  setCurrentContent(mockContents[id]);
  setLoading(false);
  return mockContents[id]; // ✅
}

      try {
        const content = await ContentService.getContentById(api, id);

        setCachedContent(id, content)
        setCurrentContent(content);
        
        // OPCIONAL: também atualiza na lista se já existir
        setContents(prev => {
          const exists = prev.some(c => c.id === id);
          if (exists) {
            return prev.map(c => c.id === id ? content : c);
          }
          return prev;
        });
        
        return content;
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || err.message || 'Erro ao carregar conteúdo';
        console.error('Erro ao buscar conteúdo:', err);
        setError(errorMsg);
        setCurrentContent(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const createContent = useCallback(async (data: CreateContentDto): Promise<Content | null> => {
    setError(null);
    try {
      const newContent = await ContentService.createContent(api, data);
      setContents(prev => [newContent, ...prev]);
      return newContent;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao criar conteúdo';
      setError(errorMsg);
      console.error('Erro ao criar conteúdo:', err);
      return null;
    }
  }, [api]);

  const updateContent = useCallback(async (
    id: string, 
    data: UpdateContentDto
  ): Promise<Content | null> => {
    setError(null);
    snapshotRef.current = null;

    try {
      const updated = await ContentService.updateContent(api, id, data);
      setContents(prev => prev.map(c => c.id === id ? updated : c));
      
      // Atualiza currentContent se for o mesmo ID
      if (currentContent?.id === id) {
        setCurrentContent(updated);
      }
      
      return updated;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao atualizar conteúdo';
      setError(errorMsg);
      console.error('Erro ao atualizar conteúdo:', err);
      return null;
    } finally {
      snapshotRef.current = null;
    }
  }, [api, currentContent]);

  const updateStatus = useCallback(async (
    id: string, 
    status: ContentStatus
  ): Promise<Content | null> => {
    setError(null);
    snapshotRef.current = null;
    
    setContents(prev => {
      snapshotRef.current = prev;
      return prev.map(c => c.id === id ? { ...c, status } : c);
    });
    
    try {
      const updated = await ContentService.updateContentStatus(api, id, status);
      setContents(prev => prev.map(c => c.id === id ? updated : c));
      
      if (currentContent?.id === id) {
        setCurrentContent(updated);
      }
      
      return updated;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao atualizar status';
      setError(errorMsg);
      console.error('Erro ao atualizar status:', err);
      
      // Reverte para snapshot
      if (snapshotRef.current) {
        setContents(snapshotRef.current);
      }
      
      return null;
    } finally {
      snapshotRef.current = null;
    }
  }, [api, currentContent]);

  const updateVisibility = useCallback(async (
    id: string, 
    visibility: ContentVisibility
  ): Promise<Content | null> => {
    setError(null);
    try {
      const updated = await ContentService.updateContentVisibility(api, id, visibility);
      setContents(prev => prev.map(c => c.id === id ? updated : c));
      
      if (currentContent?.id === id) {
        setCurrentContent(updated);
      }
      
      return updated;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao atualizar visibilidade';
      setError(errorMsg);
      console.error('Erro ao atualizar visibilidade:', err);
      return null;
    }
  }, [api, currentContent]);

  const deleteContent = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await ContentService.deleteContent(api, id);
      setContents(prev => prev.filter(c => c.id !== id));
      
      if (currentContent?.id === id) {
        setCurrentContent(null);
      }
      
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao deletar conteúdo';
      setError(errorMsg);
      console.error('Erro ao deletar conteúdo:', err);
      return false;
    }
  }, [api, currentContent]);

  return {
    contents,
    currentContent,
    loading,
    error,
    fetchContents,
    fetchContentsByCategory,
    fetchContentById,
    createContent,
    updateContent,
    updateStatus,
    updateVisibility,
    deleteContent,
    clearError,
    clearCurrentContent,
    setContents,
    homeSliders,
    fetchHomeContents,
  };
}