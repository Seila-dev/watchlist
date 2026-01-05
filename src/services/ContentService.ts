// services/contentService.ts
import { Content, ContentStatus, ContentVisibility, CreateContentDto, GetContentsParams, UpdateContentDto } from '@/types/content';
import { AxiosInstance } from 'axios';


/**
 * Helper para garantir headers corretos em todas as requisições
 */
function withAuthHeaders(api: AxiosInstance) {
    const token = (api.defaults.headers as any)?.Authorization;

    return {
        headers: {
            ...(token ? { Authorization: token } : {}),
            'Content-Type': 'application/json',
        },
    };
}

class ContentService {
    /**
     * Lista todos os conteúdos
     */
    static async getContents(api: AxiosInstance, params?: GetContentsParams) {
        const config = {
            ...withAuthHeaders(api),
            params,
        };

        const response = await api.get('/contents', config);

        return {
            data: response.data.items,
            total: response.data.total,
            page: response.data.page,
            limit: response.data.limit,
        };
    }

    /**
     * Lista por categoria
     */
    static async getContentsByCategory(
        api: AxiosInstance,
        category: string,
        params?: Omit<GetContentsParams, 'category'>
    ) {
        const config = {
            ...withAuthHeaders(api),
            params,
        };

            const response = await api.get(`/contents/category/${category}`, config);

    return {
      data: response.data.items,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
    };
    }

    /**
     * Buscar por ID
     */
    static async getContentById(api: AxiosInstance, id: string) {
        const response = await api.get<Content>(
            `/contents/${id}`,
            withAuthHeaders(api)
        );
        return response.data;
    }

    /**
     * Criar conteúdo
     */
    static async createContent(api: AxiosInstance, data: CreateContentDto) {
        const response = await api.post<Content>(
            '/contents',
            data,
            withAuthHeaders(api)
        );
        return response.data;
    }

    /**
     * Atualizar conteúdo inteiro
     */
    static async updateContent(api: AxiosInstance, id: string, data: UpdateContentDto) {
        const response = await api.patch<Content>(
            `/contents/${id}`,
            data,
            withAuthHeaders(api)
        );
        return response.data;
    }

    /**
     * Atualizar só o status
     */
    static async updateContentStatus(api: AxiosInstance, id: string, status: ContentStatus) {
        const response = await api.patch<Content>(
            `/contents/${id}/status`,
            { status },
            withAuthHeaders(api)
        );
        return response.data;
    }

    /**
     * Atualizar visibilidade
     */
    static async updateContentVisibility(api: AxiosInstance, id: string, visibility: ContentVisibility) {
        const response = await api.patch<Content>(
            `/contents/${id}/visibility`,
            { visibility },
            withAuthHeaders(api)
        );
        return response.data;
    }

    /**
     * Deletar conteúdo
     */
    static async deleteContent(api: AxiosInstance, id: string) {
        const response = await api.delete(
            `/contents/${id}`,
            withAuthHeaders(api)
        );
        return response.data;
    }

    /**
     * Recomendações
     */
    static async getRecommendations(api: AxiosInstance, id: string, limit = 10) {
        const config = {
            ...withAuthHeaders(api),
            params: { limit },
        };

        const response = await api.get(
            `/contents/${id}/recommendations`,
            config
        );

        return response.data;
    }

static async getHomeContents(
  api: AxiosInstance, 
  params?: { limit?: number; category?: string }
) {
  const config = {
    ...withAuthHeaders(api),
    params,
  };

  const response = await api.get('/contents/home', config);
  return response.data; // { sliders: { watching, toWatch, finished }, requested }
}
}

export default ContentService;
