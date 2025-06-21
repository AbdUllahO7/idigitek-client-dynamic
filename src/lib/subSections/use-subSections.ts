import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Base subsection hook
export function useSubSections() {
  const queryClient = useQueryClient();
  const endpoint = '/subsections';

  // Query keys
  const subsectionsKey = ['subsections']; 
  const subsectionKey = (id: string | null ) => [...subsectionsKey, id];
  const subsectionBySectionItemKey = (sectionItemId: string) => [...subsectionsKey, 'sectionItem', sectionItemId];
  const subsectionBySectionKey = (sectionId: string) => [...subsectionsKey, 'section', sectionId];
  const mainSubsectionBySectionKey = (sectionId: string) => [...subsectionBySectionKey(sectionId), 'main'];
  const completeSubsectionBySectionKey = (sectionId: string) => [...subsectionBySectionKey(sectionId), 'complete'];
  const subsectionsByWebSiteKey = (websiteId: string) => [...subsectionsKey, 'website', websiteId];
  const mainSubsectionByWebSiteKey = (websiteId: string) => [...subsectionsByWebSiteKey(websiteId), 'main'];
  const navigationSubsectionByWebSiteKey = (websiteId: string) => [...subsectionsByWebSiteKey(websiteId), 'navigation'];
  const sectionsKey = ['sections'];
  const subsectionsBySectionItemsKey = (sectionItemIds: string[]) => [...subsectionsKey, 'sectionItems', sectionItemIds.join(',')];
  const completeSubsectionsByWebSiteKey = (websiteId: string) => [...subsectionsByWebSiteKey(websiteId), 'complete'];

  const useGetByWebSiteId = (
    websiteId: string,
    activeOnly = true,
    limit = 100,
    skip = 0,
    includeContentCount = false
  ) => {
    return useQuery({
      queryKey: [...subsectionsByWebSiteKey(websiteId), { activeOnly, limit, skip, includeContentCount }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}`, {
          params: { activeOnly, limit, skip, includeContentCount }
        });
        return data;
      },
      enabled: !!websiteId && websiteId !== "null"
    });
  };
 
  const useGetAll = (activeOnly = true, limit = 100, skip = 0, includeContentCount = false) => {
    return useQuery({
      queryKey: [...subsectionsKey, { activeOnly, limit, skip, includeContentCount }],
      queryFn: async () => {
        const { data } = await apiClient.get(endpoint, {
          params: { activeOnly, limit, skip, includeContentCount }
        });
        return data;
      }
    });
  };

  // Get a single subsection by ID
  const useGetById = (id: string, populateSectionItem = true, includeContent = false) => {
    return useQuery({
      queryKey: [...subsectionKey(id), { populateSectionItem, includeContent }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/${id}`, {
          params: { populate: populateSectionItem, includeContent }
        });
        return data;
      },
      enabled: !!id
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
      queryKey: [...subsectionBySectionItemKey(sectionItemId), { activeOnly, limit, skip, includeContentCount }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/sectionItem/${sectionItemId}`, {
          params: { activeOnly, limit, skip, includeContentCount ,populateSectionItem }

        });
        return data;
      },
      enabled: !!sectionItemId && sectionItemId !== "null"
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
      queryKey: [...subsectionBySectionKey(sectionId), { activeOnly, limit, skip }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/section/${sectionId}`, {
          params: { activeOnly, limit, skip }
        });
        return data;
      },
      enabled: !!sectionId && sectionId !== "null"
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
      queryKey: [...completeSubsectionBySectionKey(sectionId), { activeOnly, limit, skip }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/section/${sectionId}/complete`, {
          params: { activeOnly, limit, skip }
        });
        return data;
      },
      enabled: !!sectionId && sectionId !== "null"
    });
  };

  // Get main subsection for a section
  const useGetMainBySectionId = (sectionId: string) => {
    return useQuery({
      queryKey: mainSubsectionBySectionKey(sectionId),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/section/${sectionId}/main`);
        return data;
      },
      enabled: !!sectionId && sectionId !== "null"
    });
  };

  // Get complete subsection by ID (with all elements and translations)
  const useGetCompleteById = (id: string, populateSectionItem = true) => {
    return useQuery({
      queryKey: [...subsectionKey(id), 'complete', { populateSectionItem }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/${id}/complete`, {
          params: { populate: populateSectionItem }
        });
        return data;
      },
      enabled: !!id
    });
  };

  // Get main subsection for a WebSite
  const useGetMainByWebSiteId = (websiteId: string) => {
    return useQuery({
      queryKey: mainSubsectionByWebSiteKey(websiteId),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}/main`);
        return data;
      },
      enabled: !!websiteId && websiteId !== "null"
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
      queryKey: [...navigationSubsectionByWebSiteKey(websiteId), { activeOnly, limit, skip }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}/navigation`, {
          params: { activeOnly, limit, skip }
        });
        return data;
      },
      enabled: !!websiteId && websiteId !== "null"
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
        queryKey: [...subsectionsBySectionItemsKey(sectionItemIds), { activeOnly, limit, skip, includeContentCount }],
        queryFn: async () => {
          const { data } = await apiClient.post(`${endpoint}/sectionItems`, { sectionItemIds }, {
            params: { activeOnly, limit, skip, includeContentCount, populateSectionItem }
          });
          return data;
        },
        enabled: !!sectionItemIds && sectionItemIds.length > 0 && sectionItemIds.every(id => !!id && id !== "null")
      });
    };
const useGetCompleteByWebSiteId = (
    websiteId: string,
    activeOnly = true,
    limit = 100,
    skip = 0
  ) => {
    return useQuery({
      queryKey: [...completeSubsectionsByWebSiteKey(websiteId), { activeOnly, limit, skip }],
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}/complete`, {
          params: { activeOnly, limit, skip }
        });
        return data;
      },
      enabled: !!websiteId && websiteId !== "null"
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