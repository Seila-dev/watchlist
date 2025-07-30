'use client';

import { parseCookies, destroyCookie } from 'nookies';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'watchlist.token';

const createApiInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
  });

  api.interceptors.request.use(
    (config) => {
      const { cookieName: token } = parseCookies();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        console.warn('Authentication failed - token may be expired');
        destroyCookie(null, cookieName);
      }
      return Promise.reject(error);
    }
  )

  return api;
}

let apiInstance: AxiosInstance | null = null;

export function useApi() {
  const api = useMemo(() => {
    if (!apiInstance) {
      apiInstance = createApiInstance();
    }
    return apiInstance;
  }, []);

  return api;
}

export function getClientToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const { cookieName: token } = parseCookies();
  return token;
}

// Optional: Hook for making authenticated requests with better error handling
export function useAuthenticatedRequest() {
  const api = useApi();
  
  const makeRequest = useCallback(async <T>(
    requestFn: (api: AxiosInstance) => Promise<T>
  ): Promise<T> => {
    try {
      return await requestFn(api);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }, [api]);

  return makeRequest;
}

export function getServerApi(token?: string): AxiosInstance {
  const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return api;
}