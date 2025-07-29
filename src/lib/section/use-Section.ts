import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import apiClient from '../api-client';
import { CreateSectionRequest, Section, SectionItem, SectionOrderUpdateRequest, SectionQueryParams, SectionResponse, SubSection, SupportedLanguage, UpdateSectionRequest } from '@/api/types/section/section.type';
import { useLanguage } from '@/contexts/language-context';
import { getMultilingualDescription, getMultilingualName } from '@/utils/MultilingualManagement';

// Query key factory - moved outside to prevent recreation
const createQueryKeys = () => ({
  all: ['sections'] as const,
  lists: () => [...createQueryKeys().all, 'list'] as const,
  list: (filters: Record<string, any>) => [...createQueryKeys().lists(), filters] as const,
  details: () => [...createQueryKeys().all, 'detail'] as const,
  detail: (id: string, options?: Record<string, any>) => [...createQueryKeys().details(), id, options] as const,
  websites: () => [...createQueryKeys().all, 'website'] as const,
  website: (websiteId: string, options?: Record<string, any>) => [...createQueryKeys().websites(), websiteId, options] as const,
  complete: (id: string) => [...createQueryKeys().detail(id), 'complete'] as const,
  allComplete: () => [...createQueryKeys().all, 'allComplete'] as const,
  websiteComplete: (websiteId: string) => [...createQueryKeys().website(websiteId), 'complete'] as const,
});

// Base section hook
export function useSections() {
  const queryClient = useQueryClient();
  const endpoint = '/sections';
  const { language } = useLanguage();

  // Memoized query keys factory
  const queryKeys = useMemo(() => createQueryKeys(), []);

  // Memoized helper functions to prevent recreation on every render
  const getSectionNameByLanguage = useCallback((section: Section): string => {
    if (section.displayName) {
      return section.displayName; // Use server-provided display name
    }
    
    return getMultilingualName(section, language as SupportedLanguage);
  }, [language]);

  const getSectionDescriptionByLanguage = useCallback((section: Section): string => {
    if (section.displayDescription) {
      return section.displayDescription; // Use server-provided display description
    }
    
    return getMultilingualDescription(section, language as SupportedLanguage);
  }, [language]);

  // Optimized error handler
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Error ${context}:`, error);
    throw error;
  }, []);

  // Get all sections (optionally with section items count)
  const useGetAll = (includeItemsCount = false, activeOnly = true) => {
    return useQuery({
      queryKey: queryKeys.list({ includeItemsCount, activeOnly, language }),
      queryFn: async (): Promise<SectionResponse> => {
        try {
          const params: SectionQueryParams = { 
            includeItemsCount, 
            activeOnly,
            language: language as SupportedLanguage
          };
          
          const { data } = await apiClient.get(endpoint, { params });
          return data;
        } catch (error: any) {
          handleError(error, "fetching sections");
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get a single section by ID (optionally with section items)
  const useGetById = (id: string, includeItems = false) => {
    return useQuery({
      queryKey: queryKeys.detail(id, { includeItems, language }),
      queryFn: async (): Promise<SectionResponse> => {
        try {
          const params: SectionQueryParams = { 
            includeItems,
            language: language as SupportedLanguage
          };
          
          const { data } = await apiClient.get(`${endpoint}/${id}`, { params });
          return data;
        } catch (error: any) {
          handleError(error, `fetching section ${id}`);
        }
      },
      enabled: !!id && id !== 'undefined' && id !== 'null',
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get all sections for a specific website with language support
  const useGetByWebsiteId = (
    websiteId: string,
    includeInactive = false,
    enabled = true
  ) => {
    return useQuery({
      queryKey: queryKeys.website(websiteId, { includeInactive, language }),
      queryFn: async (): Promise<SectionResponse> => {
        try {
          const params: SectionQueryParams = {
            includeInactive,
            language: language as SupportedLanguage,
            websiteId
          };
          
          const { data } = await apiClient.get(`${endpoint}/website/${websiteId}`, { params });
          return data;
        } catch (error: any) {
          handleError(error, `fetching sections for website ${websiteId}`);
        }
      },
      enabled: !!websiteId && enabled && websiteId !== 'undefined' && websiteId !== 'null',
      staleTime: 0,
      gcTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Optimized cache invalidation helper
  const invalidateWebsiteQueries = useCallback((websiteId: string) => {
    const websiteIdStr = websiteId.toString();
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.website(websiteIdStr)
    });
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.websiteComplete(websiteIdStr)
    });
  }, [queryClient, queryKeys]);

  // Optimized cache invalidation for section updates
  const invalidateSectionQueries = useCallback((sectionId?: string, websiteId?: string) => {
    // Batch invalidations for better performance
    const invalidations = [
      { queryKey: queryKeys.all },
      { queryKey: queryKeys.allComplete() }
    ];

    if (sectionId) {
      invalidations.push(
        { queryKey: queryKeys.detail(sectionId) },
        { queryKey: queryKeys.complete(sectionId) }
      );
    }

    // Execute all invalidations
    invalidations.forEach(invalidation => {
      queryClient.invalidateQueries(invalidation);
    });

    // Handle website-specific invalidations
    if (websiteId) {
      invalidateWebsiteQueries(websiteId);
    }
  }, [queryClient, queryKeys, invalidateWebsiteQueries]);

  // Create a new section with multilingual support
  const useCreate = () => {
    return useMutation({
      mutationFn: async (createDto: CreateSectionRequest): Promise<Section> => {
        try {
          // Validation is handled by the utility functions and backend
          const { data } = await apiClient.post(endpoint, createDto);
          return data;
        } catch (error: any) {
          // Enhanced error handling for duplicate entries
          if (error.message?.includes('duplicate') || 
              error.message?.includes('E11000') || 
              error.message?.includes('already exists')) {
            const enhancedError = new Error(`A section with one of these names already exists.`);
            throw enhancedError;
          }
          
          throw error;
        }
      },
      onSuccess: (data) => {
        // Optimistic update for better UX
        if (data._id) {
          queryClient.setQueryData(queryKeys.detail(data._id), data);
        }
        
        // Batch invalidations
        invalidateSectionQueries(data._id, data.WebSiteId?.toString());
      },
    });
  };

  // Update a section with multilingual support
  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: UpdateSectionRequest}): Promise<Section> => {
        try {
          // Validation is handled by the utility functions and backend
          const { data: responseData } = await apiClient.put(`${endpoint}/${id}`, data);
          return responseData;
        } catch (error: any) {
          // Enhanced error handling for duplicate entries
          if (error.message?.includes('duplicate') || 
              error.message?.includes('E11000') || 
              error.message?.includes('already exists')) {
            const enhancedError = new Error(`A section with one of these names already exists.`);
            throw enhancedError;
          }
          
          throw error;
        }
      },
      onSuccess: (data, { id }) => {
        // Optimistic update
        queryClient.setQueryData(queryKeys.detail(id), data);
        
        // Batch invalidations
        invalidateSectionQueries(id, data.WebSiteId?.toString());
      },
    });
  };

  // Toggle active status
  const useToggleActive = () => {
    return useMutation({
      mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<Section> => {
        try {
          const { data: responseData } = await apiClient.patch(`${endpoint}/${id}/status`, { isActive });
          return responseData;
        } catch (error: any) {
          handleError(error, `toggling section ${id} active status`);
        }
      },
      onSuccess: (data, { id }) => {
        // Optimistic update
        queryClient.setQueryData(queryKeys.detail(id), data);
        
        // Batch invalidations
        invalidateSectionQueries(id, data.WebSiteId?.toString());
      },
    });
  };

  // Delete a section - optimized to avoid unnecessary GET request
  const useDelete = (hardDelete: boolean = false) => {
    return useMutation({
      mutationFn: async (id: string): Promise<{ websiteId?: string }> => {
        try {
          // Get cached section data first to avoid unnecessary API call
          const cachedSection = queryClient.getQueryData(queryKeys.detail(id));
          let websiteId: string | undefined;
          
          if (cachedSection) {
            websiteId = (cachedSection as any)?.data?.WebSiteId || (cachedSection as any)?.WebSiteId;
          } else {
            // Only fetch if not in cache
            const { data: section } = await apiClient.get(`${endpoint}/${id}`);
            websiteId = section?.data?.WebSiteId;
          }
          
          await apiClient.delete(`${endpoint}/${id}`, {
            params: { hardDelete }
          });
          
          return { websiteId };
        } catch (error) {
          handleError(error, `deleting section ${id}`);
        }
      },
      onSuccess: ({ websiteId }, id) => {
        // Remove specific queries first
        queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
        queryClient.removeQueries({ queryKey: queryKeys.complete(id) });
        
        // Then invalidate related queries
        invalidateSectionQueries(undefined, websiteId);
      },
    });
  };

  // Update section order with proper typing
  const useUpdateOrder = () => {
    return useMutation({
      mutationFn: async (orderData: SectionOrderUpdateRequest): Promise<Section[]> => {
        try {
          const { data } = await apiClient.patch(`${endpoint}/order`, orderData);
          return data;
        } catch (error: any) {
          handleError(error, 'updating section order');
        }
      },
      onSuccess: (updatedSections) => {
        // Batch cache updates for better performance
        const websiteIds = new Set<string>();
        
        updatedSections.forEach(section => {
          if (section._id) {
            queryClient.setQueryData(queryKeys.detail(section._id), section);
          }
          if (section.WebSiteId) {
            websiteIds.add(section.WebSiteId.toString());
          }
        });

        // Invalidate general queries
        queryClient.invalidateQueries({ queryKey: queryKeys.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.allComplete() });
        
        // Invalidate website-specific queries
        websiteIds.forEach(websiteId => {
          invalidateWebsiteQueries(websiteId);
        });
      },
    });
  };

  // Add a manual function to clear all section-related cache for a user
  const clearUserSectionsCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.all });
  }, [queryClient, queryKeys]);

  // Return all hooks, including helper functions
  return {
    useGetAll,
    useGetById,
    useGetByWebsiteId,
    useCreate,
    useUpdate,
    useToggleActive,
    useDelete,
    useUpdateOrder,
    clearUserSectionsCache,
    
    // Helper functions for multilingual support
    getSectionNameByLanguage,
    getSectionDescriptionByLanguage,
  };
}