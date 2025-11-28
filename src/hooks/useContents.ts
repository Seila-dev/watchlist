// hooks/useContents.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import { useApi } from './useApi';
import ContentService from '@/services/ContentService';
import  { 
  Content, 
  ContentStatus, 
  CreateContentDto, 
  UpdateContentDto,
  GetContentsParams,
  ContentVisibility
} from '@/types/content';

interface UseContentsReturn {
  contents: Content[];
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
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;
}

export default function useContents(): UseContentsReturn {
  const api = useApi();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snapshotRef = useRef<Content[] | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchContents = useCallback(async (params?: GetContentsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ContentService.getContents(api, params);
      console.log('Conteúdos buscados:', response.data);
      setContents(response.data || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao buscar conteúdos';
      setError(errorMsg);
      console.error('Erro ao buscar conteúdos:', err);
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

  const fetchContentById = useCallback(async (id: string): Promise<Content | null> => {
    setLoading(true);
    setError(null);
    try {
      const content = await ContentService.getContentById(api, id);
      return content;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao buscar conteúdo';
      setError(errorMsg);
      console.error('Erro ao buscar conteúdo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const createContent = useCallback(async (data: CreateContentDto): Promise<Content | null> => {
    // setLoading(true);
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
    // } finally {
    //   setLoading(false);
    // }
  }, [api]);

  const updateContent = useCallback(async (
    id: string, 
    data: UpdateContentDto
  ): Promise<Content | null> => {
    // setLoading(true);
    setError(null);
    snapshotRef.current = null;

    try {
      // snapshotRef.current = [...contents];
      const updated = await ContentService.updateContent(api, id, data);
      setContents(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao atualizar conteúdo';
      setError(errorMsg);
      console.error('Erro ao atualizar conteúdo:', err);
      return null;
    } finally {
      // setLoading(false);
       snapshotRef.current = null;
    }
  }, [api]);

  const updateStatus = useCallback(async (
    id: string, 
    status: ContentStatus
  ): Promise<Content | null> => {
    // setLoading(true);
    setError(null);
     snapshotRef.current = null;
    setContents(prev => {
      snapshotRef.current = prev;
      return prev.map(c => c.id === id ? { ...c, status } : c);
    });
    try {
      const updated = await ContentService.updateContentStatus(api, id, status);
      setContents(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao atualizar status';
      setError(errorMsg);
      console.error('Erro ao atualizar status:', err);
      return null;
    } finally {
      // setLoading(false);
      snapshotRef.current = null;
    }
  }, [api]);

  const updateVisibility = useCallback(async (
    id: string, 
    visibility: ContentVisibility
  ): Promise<Content | null> => {
    // setLoading(true);
    setError(null);
    try {
      const updated = await ContentService.updateContentVisibility(api, id, visibility);
      setContents(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao atualizar visibilidade';
      setError(errorMsg);
      console.error('Erro ao atualizar visibilidade:', err);
      return null;
    }
    // } finally {
    //   setLoading(false);
    // }
  }, [api]);

  const deleteContent = useCallback(async (id: string): Promise<boolean> => {
    // setLoading(true);
    setError(null);
    try {
      await ContentService.deleteContent(api, id);
      setContents(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao deletar conteúdo';
      setError(errorMsg);
      console.error('Erro ao deletar conteúdo:', err);
      return false;
    }
    // } finally {
    //   setLoading(false);
    // }
  }, [api]);

  return {
    contents,
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
    setContents,
  };
}