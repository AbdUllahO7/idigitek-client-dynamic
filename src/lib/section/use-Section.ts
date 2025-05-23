import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';
import { Section } from '@/api/types/section/section.type';

// Base section hook
export function useSections() {
  const queryClient = useQueryClient();
  const endpoint = '/sections';

  // Query keys
  const sectionsKey = ['sections'];
  const sectionKey = (id: string) => [...sectionsKey, id];
  const completeDataKey = (id: string) => [...sectionKey(id), 'complete'];
  const allCompleteDataKey = [...sectionsKey, 'allComplete'];
  const websiteSectionsKey = (websiteId: string) => [...sectionsKey, 'website', websiteId];
  const websiteSectionsCompleteKey = (websiteId: string) => [...websiteSectionsKey(websiteId), 'complete'];

  // Get all sections (optionally with section items count)
  const useGetAll = (includeItemsCount = false, activeOnly = true) => {
    return useQuery({
      queryKey: [...sectionsKey, { includeItemsCount, activeOnly }],
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(endpoint, {
            params: { includeItemsCount, activeOnly }
          });
          return data;
        } catch (error: any) {
          console.error("Error fetching sections:", error);
          throw error;
        }
      },
    });
  };

  // Get a single section by ID (optionally with section items)
  const useGetById = (id: string, includeItems = false) => {
    return useQuery({
      queryKey: [...sectionKey(id), { includeItems }],
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/${id}`, {
            params: { includeItems }
          });
          return data;
        } catch (error: any) {
          console.error(`Error fetching section ${id}:`, error);
          throw error;
        }
      },
      enabled: !!id && id !== 'undefined' && id !== 'null',
    });
  };

  // Get all sections for a specific website
  const useGetByWebsiteId = (
    websiteId: string,
    includeInactive = false,
    enabled = true
  ) => {
    return useQuery({
      queryKey: [...websiteSectionsKey(websiteId), { includeInactive }],
      queryFn: async () => {
        try {
          const params = new URLSearchParams();
          params.append('includeInactive', String(includeInactive));
          
          const { data } = await apiClient.get(`${endpoint}/website/${websiteId}?${params.toString()}`);
          return data;
        } catch (error: any) {
          console.error(`Error fetching sections for website ${websiteId}:`, error);
          throw error;
        }
      },
      enabled: !!websiteId && enabled && websiteId !== 'undefined' && websiteId !== 'null',
      staleTime: 0,
    });
  };

  // Create a new section
  const useCreate = () => {
    return useMutation({
      mutationFn: async (createDto: Omit<Section, '_id'>) => {
        try {
          const { data } = await apiClient.post(endpoint, createDto);
          return data;
        } catch (error: any) {
          if (error.message?.includes('duplicate') || 
              error.message?.includes('E11000') || 
              error.message?.includes('already exists')) {
            const enhancedError = new Error(`A section with the name "${createDto.name}" already exists.`);
            throw enhancedError;
          }
          throw error;
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: sectionsKey });
        if (data._id) {
          queryClient.setQueryData(sectionKey(data._id), data);
        }
        if (data.WebSiteId) {
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsKey(data.WebSiteId.toString()) 
          });
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsCompleteKey(data.WebSiteId.toString()) 
          });
        }
      },
    });
  };

  // Update a section
  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<Section> }) => {
        try {
          const { data: responseData } = await apiClient.put(`${endpoint}/${id}`, data);
          return responseData;
        } catch (error: any) {
          if (error.message?.includes('duplicate') || 
              error.message?.includes('E11000') || 
              error.message?.includes('already exists')) {
            const enhancedError = new Error(`A section with the name "${data.name}" already exists.`);
            throw enhancedError;
          }
          throw error;
        }
      },
      onSuccess: (data, { id }) => {
        queryClient.setQueryData(sectionKey(id), data);
        queryClient.invalidateQueries({ queryKey: sectionsKey });
        queryClient.invalidateQueries({ queryKey: completeDataKey(id) });
        queryClient.invalidateQueries({ queryKey: allCompleteDataKey });
        if (data.WebSiteId) {
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsKey(data.WebSiteId.toString()) 
          });
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsCompleteKey(data.WebSiteId.toString()) 
          });
        }
      },
    });
  };

  // Toggle active status
  const useToggleActive = () => {
    return useMutation({
      mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
        try {
          const { data: responseData } = await apiClient.patch(`${endpoint}/${id}/status`, { isActive });
          return responseData;
        } catch (error: any) {
          console.error(`Error toggling section ${id} active status:`, error);
          throw error;
        }
      },
      onSuccess: (data, { id }) => {
        queryClient.setQueryData(sectionKey(id), data);
        queryClient.invalidateQueries({ queryKey: sectionsKey });
        queryClient.invalidateQueries({ queryKey: completeDataKey(id) });
        queryClient.invalidateQueries({ queryKey: allCompleteDataKey });
        if (data.WebSiteId) {
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsKey(data.WebSiteId.toString()) 
          });
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsCompleteKey(data.WebSiteId.toString()) 
          });
        }
      },
    });
  };

  // Delete a section
  const useDelete = (hardDelete: boolean = false) => {
    return useMutation({
      mutationFn: async (id: string) => {
        try {
          const { data: section } = await apiClient.get(`${endpoint}/${id}`);
          const websiteId = section?.data?.WebSiteId;
          
          await apiClient.delete(`${endpoint}/${id}`, {
            params: { hardDelete }
          });
          
          return { websiteId };
        } catch (error) {
          console.error(`Error deleting section ${id}:`, error);
          throw error;
        }
      },
      onSuccess: ({ websiteId }, id) => {
        queryClient.removeQueries({ queryKey: sectionKey(id) });
        queryClient.removeQueries({ queryKey: completeDataKey(id) });
        queryClient.invalidateQueries({ queryKey: sectionsKey });
        queryClient.invalidateQueries({ queryKey: allCompleteDataKey });
        if (websiteId) {
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsKey(websiteId.toString()) 
          });
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsCompleteKey(websiteId.toString()) 
          });
        }
      },
    });
  };

  // Update order of multiple sections
  const useUpdateOrder = () => {
    return useMutation({
      mutationFn: async (sections: { id: string; order: number; websiteId?: string }[]) => {
        const { data } = await apiClient.put(`${endpoint}/order`, { sections });
        const websiteIds = [...new Set(
          sections
            .filter(s => s.websiteId)
            .map(s => s.websiteId!)
        )];
        return { data, websiteIds };
      },
      onSuccess: ({ websiteIds }) => {
        queryClient.invalidateQueries({ queryKey: sectionsKey });
        queryClient.invalidateQueries({ queryKey: allCompleteDataKey });
        websiteIds.forEach(websiteId => {
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsKey(websiteId) 
          });
          queryClient.invalidateQueries({ 
            queryKey: websiteSectionsCompleteKey(websiteId) 
          });
        });
      },
    });
  };

  // Clear all section-related cache
  const clearSectionsCache = () => {
    queryClient.invalidateQueries({ queryKey: sectionsKey });
  };

  return {
    useGetAll,
    useGetById,
    useGetByWebsiteId,
    useCreate,
    useUpdate,
    useToggleActive,
    useDelete,
    useUpdateOrder,
    clearSectionsCache
  };
}