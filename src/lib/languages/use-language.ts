import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';

// Define the shape of a language object (based on typical language data)
interface Language {
  id: string;
  name: string;
  code: string;
  isActive?: boolean;
  websiteId?: string;
}

// Base language hook
export function useLanguages() {
  const endpoint = '/languages';

  // Query keys without user ID
  const languagesKey = ['languages'];
  const languageKey = (id: string) => [...languagesKey, id];
  const websiteLanguagesKey = (websiteId: string) => [...languagesKey, 'website', websiteId];

  // Get all languages
  const useGetAll = (options?: { isActive?: boolean }) => {
    const queryParams = new URLSearchParams();
    
    if (options?.isActive !== undefined) {
      queryParams.append('isActive', options.isActive.toString());
    }
    
    return useQuery({
      queryKey: languagesKey,
      queryFn: async () => {
        const url = queryParams.toString() 
          ? `${endpoint}?${queryParams.toString()}` 
          : endpoint;
        const { data } = await apiClient.get<Language[]>(url);
        return data;
      },
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  // Get all languages for a specific website
  const useGetByWebsite = (websiteId: string, options?: { isActive?: boolean }) => {
    const queryParams = new URLSearchParams();
    
    if (options?.isActive !== undefined) {
      queryParams.append('isActive', options.isActive.toString());
    }
    
    return useQuery({
      queryKey: websiteLanguagesKey(websiteId),
      queryFn: async () => {
        const url = queryParams.toString() 
          ? `${endpoint}/website/${websiteId}?${queryParams.toString()}` 
          : `${endpoint}/website/${websiteId}`;
        const { data } = await apiClient.get<Language[]>(url);
        return data;
      },
      enabled: !!websiteId,
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  // Get a single language by ID
  const useGetById = (id: string) => {
    return useQuery({
      queryKey: languageKey(id),
      queryFn: async () => {
        const { data } = await apiClient.get<Language>(`${endpoint}/${id}`);
        return data;
      },
      enabled: !!id,
      staleTime: 30 * 1000, // 30 seconds
    });
  };



  // Return all hooks
  return {
    useGetAll,
    useGetByWebsite,
    useGetById,
  };
}