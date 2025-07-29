import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';
import { SectionItem } from '@/api/types/sectionItem/sectionItem.type';

// Base section item hook
export function useSectionItems() {
  const queryClient = useQueryClient();
  const endpoint = '/section-items';

  // Query keys
  const sectionItemsKey = ['sectionItems'] as const;
  const sectionItemKey = (id: string) => [...sectionItemsKey, id] as const;
  const sectionItemsBySectionKey = (sectionId: string) => [...sectionItemsKey, 'section', sectionId] as const;
  const sectionItemsByWebSiteKey = (websiteId: string) => [...sectionItemsKey, 'website', websiteId] as const;

  // Get all section items
  const useGetAll = (
    activeOnly = true,
    limit = 100,
    skip = 0,
    includeSubSectionCount = false
  ) => {
    return useQuery({
      queryKey: [...sectionItemsKey, { activeOnly, limit, skip, includeSubSectionCount }],
      queryFn: async () => {
        const { data } = await apiClient.get<SectionItem[]>(endpoint, {
          params: { activeOnly, limit, skip, includeSubSectionCount },
        });
        return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });
  };

  // Get a single section item by ID
  const useGetById = (id: string, populateSection = true, includeSubSections = false) => {
    return useQuery({
      queryKey: [...sectionItemKey(id), { populateSection, includeSubSections }],
      queryFn: async () => {
        const { data } = await apiClient.get<SectionItem>(`${endpoint}/${id}`, {
          params: { populate: populateSection, includeSubSections },
        });
        return data;
      },
      enabled: !!id && id !== 'null',
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    });
  };

  // Get section items by section ID
  const useGetBySectionId = (
    sectionId: string,
    activeOnly = true,
    limit = 100,
    skip = 0,
    includeSubSectionCount = false
  ) => {
    return useQuery({
      queryKey: [...sectionItemsBySectionKey(sectionId), { activeOnly, limit, skip, includeSubSectionCount }],
      queryFn: async () => {
        const { data } = await apiClient.get<SectionItem[]>(`${endpoint}/section/${sectionId}`, {
          params: { activeOnly, limit, skip, includeSubSectionCount },
        });
        return data;
      },
      enabled: !!sectionId && sectionId !== 'null',
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    });
  };

  // Get section items by WebSite ID
  const useGetByWebSiteId = (
    websiteId: string,
    activeOnly = true,
    limit = 100,
    skip = 0,
    includeSubSectionCount = false
  ) => {
    return useQuery({
      queryKey: [...sectionItemsByWebSiteKey(websiteId), { activeOnly, limit, skip, includeSubSectionCount }],
      queryFn: async () => {
        const { data } = await apiClient.get<SectionItem[]>(`${endpoint}/website/${websiteId}`, {
          params: { activeOnly, limit, skip, includeSubSectionCount },
        });
        return data;
      },
      enabled: !!websiteId && websiteId !== 'null',
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    });
  };

  // Create a new section item
  const useCreate = () => {
    return useMutation({
      mutationFn: async (createDto: Omit<SectionItem, '_id'>) => {
        const { data } = await apiClient.post<SectionItem>(endpoint, createDto);
        return data;
      },
      onError: (error: any) => {
        if (
          error.message?.includes('duplicate') ||
          error.message?.includes('E11000') ||
          error.message?.includes('already exists')
        ) {
          throw new Error('A section item with this name already exists.');
        }
        throw error;
      },
      onSuccess: (data) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: sectionItemsKey });
        if (data._id) {
          queryClient.setQueryData(sectionItemKey(data._id), data);
        }
        if (data.section) {
          queryClient.invalidateQueries({ queryKey: sectionItemsBySectionKey(data.section) });
        }
        if (data.WebSiteId) {
          queryClient.invalidateQueries({ queryKey: sectionItemsByWebSiteKey(data.WebSiteId) });
        }
      },
    });
  };

  // Return all hooks
  return {
    useGetAll,
    useGetById,
    useGetBySectionId,
    useGetByWebSiteId,
  };
}