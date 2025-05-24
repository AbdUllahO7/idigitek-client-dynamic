import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';
import { SectionItem } from '@/api/types/sectionItem/sectionItem.type';


// Base section item hook
export function useSectionItems() {
  const queryClient = useQueryClient();
  const endpoint = '/section-items';

  // Query keys
  const sectionItemsKey = ['sectionItems'];
  const sectionItemKey = (id: string) => [...sectionItemsKey, id];
  const sectionItemsBySectionKey = (sectionId: string) => [...sectionItemsKey, 'section', sectionId];
  const sectionItemsByWebSiteKey = (websiteId: string) => [...sectionItemsKey, 'website', websiteId];

  // Get all section items
  const useGetAll = (activeOnly = true, limit = 100, skip = 0, includeSubSectionCount = false) => {
    return useQuery({
      queryKey: [...sectionItemsKey, { activeOnly, limit, skip, includeSubSectionCount }],
      queryFn: async () => {
        const { data } = await apiClient.get(endpoint, {
          params: { activeOnly, limit, skip, includeSubSectionCount }
        });
        return data;
      }
    });
  };

  // Get a single section item by ID
  const useGetById = (id: string, populateSection = true, includeSubSections = false) => {
    return useQuery({
      queryKey: [...sectionItemKey(id), { populateSection, includeSubSections }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/${id}`, {
          params: { populate: populateSection, includeSubSections }
        });
        return data;
      },
      enabled: !!id
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
        const { data } = await apiClient.get(`${endpoint}/section/${sectionId}`, {
          params: { activeOnly, limit, skip, includeSubSectionCount }
        });
        return data;
      },
      enabled: !!sectionId && sectionId !== "null"
    });
  };

  // Get section items by WebSite ID - NEW FUNCTION
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
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}`, {
          params: { activeOnly, limit, skip, includeSubSectionCount }
        });
        return data;
      },
      enabled: !!websiteId && websiteId !== "null"
    });
  };

  // Create a new section item
  const useCreate = () => {
    return useMutation({
      mutationFn: async (createDto: Omit<SectionItem, '_id'>) => {
        try {
          const { data } = await apiClient.post(endpoint, createDto);
          return data;
        } catch (error: any) {
          if (error.message?.includes('duplicate') || 
              error.message?.includes('E11000') || 
              error.message?.includes('already exists')) {
            const enhancedError = new Error(`A section item with this name already exists.`);
            throw enhancedError;
          }
          throw error;
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: sectionItemsKey });
        if (data._id) {
          queryClient.setQueryData(sectionItemKey(data._id), data);
        }
        if (data.section) {
          queryClient.invalidateQueries({ queryKey: sectionItemsBySectionKey(data.section) });
        }
        // Add invalidation for WebSite
        if (data.WebSite) {
          queryClient.invalidateQueries({ queryKey: sectionItemsByWebSiteKey(data.WebSite) });
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