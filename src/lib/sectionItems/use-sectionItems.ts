import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';

// Base SectionItems hook
export function useSectionItems() {
    const queryClient = useQueryClient();
    const endpoint = '/sections/client';

    // Query keys to prevent cache conflicts
    const sectionItemsBySectionKey = (sectionId: string) => ['sectionItems', 'section', sectionId];
    const sectionItemsByWebsiteKey = (websiteId: string) => ['sectionItems', 'website', websiteId];
    const sectionItemByIdKey = (id: string) => ['sectionItems', 'item', id];

    // Get section items by section ID (public access)
    const useGetSectionItemsBySectionId = (
        sectionId: string,
        activeOnly: boolean = true,
        limit: number = 100,
        skip: number = 0,
        includeSubSectionCount: boolean = false,
        languageId?: string
    ) => {
        return useQuery({
            queryKey: sectionItemsBySectionKey(sectionId),
            queryFn: async () => {
                const params = new URLSearchParams();
                if (!activeOnly) params.append('activeOnly', 'false');
                params.append('limit', limit.toString());
                params.append('skip', skip.toString());
                if (includeSubSectionCount) params.append('includeSubSectionCount', 'true');
                if (languageId) params.append('languageId', languageId);

                const { data } = await apiClient.get(`${endpoint}/section/${sectionId}?${params.toString()}`);
                return data?.data || [];
            },
            refetchOnMount: true,
            staleTime: 10 * 1000, // 10 seconds
            enabled: !!sectionId,
        });
    };

    // Get section items by website ID (public access)
    const useGetSectionItemsByWebSiteId = (
        websiteId: string,
        activeOnly: boolean = true,
        limit: number = 100,
        skip: number = 0,
        includeSubSectionCount: boolean = false,
        languageId?: string
    ) => {
        return useQuery({
            queryKey: sectionItemsByWebsiteKey(websiteId),
            queryFn: async () => {
                const params = new URLSearchParams();
                if (!activeOnly) params.append('activeOnly', 'false');
                params.append('limit', limit.toString());
                params.append('skip', skip.toString());
                if (includeSubSectionCount) params.append('includeSubSectionCount', 'true');
                if (languageId) params.append('languageId', languageId);

                const { data } = await apiClient.get(`${endpoint}/website/${websiteId}?${params.toString()}`);
                return data?.data || [];
            },
            refetchOnMount: true,
            staleTime: 10 * 1000, // 10 seconds
            enabled: !!websiteId,
        });
    };

    // Get a single section item by ID (public access)
    const useGetSectionItemById = (
        id: string,
        populateSection: boolean = true,
        includeSubSections: boolean = false,
        languageId?: string
    ) => {
        return useQuery({
            queryKey: sectionItemByIdKey(id),
            queryFn: async () => {
                const params = new URLSearchParams();
                if (!populateSection) params.append('populate', 'false');
                if (includeSubSections) params.append('includeSubSections', 'true');
                if (languageId) params.append('languageId', languageId);

                const { data } = await apiClient.get(`${endpoint}/${id}?${params.toString()}`);
                return data?.data || null;
            },
            refetchOnMount: true,
            staleTime: 10 * 1000, // 10 seconds
            enabled: !!id,
        });
    };

    // Reset section items cache for a specific section, website, or all section items
    const resetSectionItemsCache = (sectionId?: string, websiteId?: string) => {
        if (sectionId) {
            queryClient.invalidateQueries({ queryKey: sectionItemsBySectionKey(sectionId) });
        } else if (websiteId) {
            queryClient.invalidateQueries({ queryKey: sectionItemsByWebsiteKey(websiteId) });
        } else {
            queryClient.invalidateQueries({ queryKey: ['sectionItems'] });
        }
    };

    return {
        useGetSectionItemsBySectionId,
        useGetSectionItemsByWebSiteId,
        useGetSectionItemById,
        resetSectionItemsCache,
    };
}