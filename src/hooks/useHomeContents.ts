import { Content, ContentStatus } from "@/types/content";
import { useApi } from "./useApi";
import { useCallback, useState } from "react";

interface FetchHomeContentsParams {
  statuses?: ContentStatus[];
  limitPerStatus?: number;
  category?: string;
}

interface UseHomeContentsReturn {
  sliders: HomeSlider[];
  loading: boolean;
  error: string | null;

  fetchHomeContents: (params?: FetchHomeContentsParams) => Promise<void>;
  clearError: () => void;
  setSliders: React.Dispatch<React.SetStateAction<HomeSlider[]>>;
}

 interface HomeSlider {
  status: ContentStatus;
  items: Content[];
  count: number;
}


export function useHomeContents(): UseHomeContentsReturn {
  const api = useApi();
  const [sliders, setSliders] = useState<HomeSlider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeContents = useCallback(async (
    params?: FetchHomeContentsParams
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/contents/home', {
        params: {
          statuses: params?.statuses?.join(','),
          limitPerStatus: params?.limitPerStatus ?? 15,
          category: params?.category,
        },
      });

      setSliders(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar home');
    } finally {
      setLoading(false);
    }
  }, [api]);

  return {
    sliders,
    loading,
    error,
    setSliders,
    fetchHomeContents,
    clearError: () => setError(null),
  };
}
