import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import apiClient from '../api-client';
import { SubSection } from '@/api/types/subSection/subSection.type';

// Define interface for activation options
export interface SubSectionActivationOptions {
  isActive: boolean;
  affectChildren?: boolean;
  recursive?: boolean;
  reason?: string;
}

// Define interface for bulk activation
export interface BulkActivationRequest {
  ids: string[];
  isActive: boolean;
  affectChildren?: boolean;
  recursive?: boolean;
  reason?: string;
}

// Define interface for scheduling activation
export interface ScheduleActivationRequest {
  id: string;
  scheduledDate: Date | string;
  options: SubSectionActivationOptions;
}

// Define interface for activation results
export interface ActivationResult {
  subsection: SubSection;
  contentElementsAffected: number;
  childSubsectionsAffected?: number;
  previousMainId?: string;
  newMainId?: string;
  statusChangeLog?: {
    timestamp: Date;
    action: string;
    reason?: string;
    performedBy?: string;
  };
  error?: string;
}

// Query key factory - optimized to prevent recreation
const createSubSectionQueryKeys = () => ({
  all: ['subsections'] as const,
  lists: () => [...createSubSectionQueryKeys().all, 'list'] as const,
  list: (filters: Record<string, any>) => [...createSubSectionQueryKeys().lists(), filters] as const,
  details: () => [...createSubSectionQueryKeys().all, 'detail'] as const,
  detail: (id: string | null, options?: Record<string, any>) => [...createSubSectionQueryKeys().details(), id, options] as const,
  
  // Section-related queries
  sections: () => [...createSubSectionQueryKeys().all, 'section'] as const,
  section: (sectionId: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().sections(), sectionId, options] as const,
  sectionMain: (sectionId: string) => [...createSubSectionQueryKeys().section(sectionId), 'main'] as const,
  sectionComplete: (sectionId: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().section(sectionId), 'complete', options] as const,
  
  // SectionItem-related queries
  sectionItems: () => [...createSubSectionQueryKeys().all, 'sectionItem'] as const,
  sectionItem: (sectionItemId: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().sectionItems(), sectionItemId, options] as const,
  sectionItemsBulk: (sectionItemIds: string[], options?: Record<string, any>) => [...createSubSectionQueryKeys().sectionItems(), 'bulk', sectionItemIds.join(','), options] as const,
  
  // Website-related queries
  websites: () => [...createSubSectionQueryKeys().all, 'website'] as const,
  website: (websiteId: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().websites(), websiteId, options] as const,
  websiteMain: (websiteId: string) => [...createSubSectionQueryKeys().website(websiteId), 'main'] as const,
  websiteNavigation: (websiteId: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().website(websiteId), 'navigation', options] as const,
  websiteComplete: (websiteId: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().website(websiteId), 'complete', options] as const,
  
  // Complete data queries
  complete: (id: string, options?: Record<string, any>) => [...createSubSectionQueryKeys().detail(id), 'complete', options] as const,
});

// Base subsection hook
export function useSubSections() {
  const queryClient = useQueryClient();
  const endpoint = '/subsections';

  // Memoized query keys factory
  const queryKeys = useMemo(() => createSubSectionQueryKeys(), []);

  // Optimized error handler
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Error ${context}:`, error);
    throw error;
  }, []);

  // Common cache configuration
  const cacheConfig = useMemo(() => ({
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }), []);

  const useGetByWebSiteId = (
    websiteId: string,
    activeOnly = true,
    limit = 100,
    skip = 0,
    includeContentCount = false
  ) => {
    return useQuery({
      queryKey: queryKeys.website(websiteId, { activeOnly, limit, skip, includeContentCount }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/website/${websiteId}`, {
            params: { activeOnly, limit, skip, includeContentCount }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching subsections for website ${websiteId}`);
        }
      },
      enabled: !!websiteId && websiteId !== "null",
      ...cacheConfig,
    });
  };
 
  const useGetAll = (activeOnly = true, limit = 100, skip = 0, includeContentCount = false) => {
    return useQuery({
      queryKey: queryKeys.list({ activeOnly, limit, skip, includeContentCount }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(endpoint, {
            params: { activeOnly, limit, skip, includeContentCount }
          });
          return data;
        } catch (error: any) {
          handleError(error, 'fetching all subsections');
        }
      },
      ...cacheConfig,
    });
  };

  // Get a single subsection by ID
  const useGetById = (id: string, populateSectionItem = true, includeContent = false) => {
    return useQuery({
      queryKey: queryKeys.detail(id, { populateSectionItem, includeContent }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/${id}`, {
            params: { populate: populateSectionItem, includeContent }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching subsection ${id}`);
        }
      },
      enabled: !!id,
      ...cacheConfig,
    });
  };

  const useGetBySectionItemId = (
    sectionItemId: string, 
    activeOnly = true, 
    limit = 100, 
    skip = 0, 
    includeContentCount = false,
    populateSectionItem = true
  ) => {
    return useQuery({
      queryKey: queryKeys.sectionItem(sectionItemId, { activeOnly, limit, skip, includeContentCount, populateSectionItem }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/sectionItem/${sectionItemId}`, {
            params: { activeOnly, limit, skip, includeContentCount, populateSectionItem }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching subsections for section item ${sectionItemId}`);
        }
      },
      enabled: !!sectionItemId && sectionItemId !== "null",
      ...cacheConfig,
    });
  };

  // Get subsections by section ID
  const useGetBySectionId = (
    sectionId: string, 
    activeOnly = true, 
    limit = 100, 
    skip = 0
  ) => {
    return useQuery({
      queryKey: queryKeys.section(sectionId, { activeOnly, limit, skip }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/section/${sectionId}`, {
            params: { activeOnly, limit, skip }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching subsections for section ${sectionId}`);
        }
      },
      enabled: !!sectionId && sectionId !== "null",
      ...cacheConfig,
    });
  };

  // Get complete subsections by section ID with all content elements and translations
  const useGetCompleteBySectionId = (
    sectionId: string, 
    activeOnly = true, 
    limit = 100, 
    skip = 0
  ) => {
    return useQuery({
      queryKey: queryKeys.sectionComplete(sectionId, { activeOnly, limit, skip }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/section/${sectionId}/complete`, {
            params: { activeOnly, limit, skip }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching complete subsections for section ${sectionId}`);
        }
      },
      enabled: !!sectionId && sectionId !== "null",
      ...cacheConfig,
    });
  };

  // Get main subsection for a section
  const useGetMainBySectionId = (sectionId: string) => {
    return useQuery({
      queryKey: queryKeys.sectionMain(sectionId),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/section/${sectionId}/main`);
          return data;
        } catch (error: any) {
          handleError(error, `fetching main subsection for section ${sectionId}`);
        }
      },
      enabled: !!sectionId && sectionId !== "null",
      ...cacheConfig,
    });
  };

  // Get complete subsection by ID (with all elements and translations)
  const useGetCompleteById = (id: string, populateSectionItem = true) => {
    return useQuery({
      queryKey: queryKeys.complete(id, { populateSectionItem }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/${id}/complete`, {
            params: { populate: populateSectionItem }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching complete subsection ${id}`);
        }
      },
      enabled: !!id,
      ...cacheConfig,
    });
  };

  // Get main subsection for a WebSite
  const useGetMainByWebSiteId = (websiteId: string) => {
    return useQuery({
      queryKey: queryKeys.websiteMain(websiteId),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/website/${websiteId}/main`);
          return data;
        } catch (error: any) {
          handleError(error, `fetching main subsection for website ${websiteId}`);
        }
      },
      enabled: !!websiteId && websiteId !== "null",
      ...cacheConfig,
    });
  };

  // Get navigation subsections for a WebSite (returns array - could be multiple)
  const useGetNavigationByWebSiteId = (
    websiteId: string, 
    activeOnly = true, 
    limit = 100, 
    skip = 0
  ) => {
    return useQuery({
      queryKey: queryKeys.websiteNavigation(websiteId, { activeOnly, limit, skip }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/website/${websiteId}/navigation`, {
            params: { activeOnly, limit, skip }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching navigation subsections for website ${websiteId}`);
        }
      },
      enabled: !!websiteId && websiteId !== "null",
      ...cacheConfig,
    });
  };

  const useGetBySectionItemIds = (
      sectionItemIds: string[], 
      activeOnly = true, 
      limit = 100, 
      skip = 0, 
      includeContentCount = false,
      populateSectionItem = true
    ) => {
      return useQuery({
        queryKey: queryKeys.sectionItemsBulk(sectionItemIds, { activeOnly, limit, skip, includeContentCount, populateSectionItem }),
        queryFn: async () => {
          try {
            const { data } = await apiClient.post(`${endpoint}/sectionItems`, { sectionItemIds }, {
              params: { activeOnly, limit, skip, includeContentCount, populateSectionItem }
            });
            return data;
          } catch (error: any) {
            handleError(error, `fetching subsections for section items: ${sectionItemIds.join(', ')}`);
          }
        },
        enabled: !!sectionItemIds && sectionItemIds.length > 0 && sectionItemIds.every(id => !!id && id !== "null"),
        ...cacheConfig,
      });
    };

  const useGetCompleteByWebSiteId = (
    websiteId: string,
    activeOnly = true,
    limit = 100,
    skip = 0
  ) => {
    return useQuery({
      queryKey: queryKeys.websiteComplete(websiteId, { activeOnly, limit, skip }),
      queryFn: async () => {
        try {
          const { data } = await apiClient.get(`${endpoint}/website/${websiteId}/complete`, {
            params: { activeOnly, limit, skip }
          });
          return data;
        } catch (error: any) {
          handleError(error, `fetching complete subsections for website ${websiteId}`);
        }
      },
      enabled: !!websiteId && websiteId !== "null",
      ...cacheConfig,
    });
  };

  // Return all hooks including the new navigation hook
  return {
    useGetAll,
    useGetById,
    useGetBySectionItemId,
    useGetBySectionId,
    useGetCompleteBySectionId,
    useGetMainBySectionId,
    useGetCompleteById,
    useGetByWebSiteId,
    useGetMainByWebSiteId,
    useGetNavigationByWebSiteId,
    useGetBySectionItemIds,
    useGetCompleteByWebSiteId
  };
}