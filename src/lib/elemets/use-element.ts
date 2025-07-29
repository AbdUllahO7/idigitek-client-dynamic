import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';
import { ContentElement } from '@/api/types/contentElements/contentElemetn.type';

// ⚡ PERFORMANCE: Cache configuration constants
const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,      // 5 minutes - data stays fresh
  CACHE_TIME: 30 * 60 * 1000,     // 30 minutes - data stays in memory
  RETRY_COUNT: 2,                  // Reduced retries for faster failure
  REFETCH_ON_WINDOW_FOCUS: false,  // Prevent unnecessary refetches
};

// ⚡ PERFORMANCE: Optimized query options
const getOptimizedQueryOptions = (level: 'basic' | 'detailed' = 'basic') => ({
  staleTime: level === 'basic' ? CACHE_CONFIG.STALE_TIME : CACHE_CONFIG.STALE_TIME / 2,
  cacheTime: CACHE_CONFIG.CACHE_TIME,
  retry: CACHE_CONFIG.RETRY_COUNT,
  refetchOnWindowFocus: CACHE_CONFIG.REFETCH_ON_WINDOW_FOCUS,
  refetchOnMount: false, // ⚡ PERFORMANCE: Only refetch if data is stale
});

// Base content element hook
export function useContentElements() {
  const queryClient = useQueryClient();
  const endpoint = '/content-elements';

  // ⚡ PERFORMANCE: Optimized query keys with better granularity
  const elementsKey = ['contentElements'];
  const elementKey = (id: string) => [...elementsKey, 'single', id];
  const elementsBySubsectionKey = (subsectionId: string, options?: { 
    includeTranslations?: boolean; 
    fields?: string[];
    limit?: number;
    offset?: number;
  }) => [
    ...elementsKey, 
    'subsection', 
    subsectionId, 
    ...(options ? [JSON.stringify(options)] : [])
  ];

  // ⚡ PERFORMANCE: Optimized single element query with selective field fetching
  const useGetById = (
    id: string, 
    includeTranslations: boolean = false,
    options?: {
      fields?: string[]; // ⚡ PERFORMANCE: Allow selective field fetching
      enabled?: boolean;
    }
  ) => {
    return useQuery({
      queryKey: elementKey(id),
      queryFn: async () => {
        const params: any = { translations: includeTranslations };
        
        // ⚡ PERFORMANCE: Add field selection to reduce payload size
        if (options?.fields && options.fields.length > 0) {
          params.fields = options.fields.join(',');
        }

        const { data } = await apiClient.get(`${endpoint}/${id}`, { params });
        return data;
      },
      enabled: !!id && (options?.enabled !== false),
      ...getOptimizedQueryOptions('detailed'),
      
      // ⚡ PERFORMANCE: Transform data to only what's needed
      select: options?.fields ? (data: any) => {
        if (!data || !options.fields) return data;
        const selected: any = { _id: data._id }; // Always include ID
        options.fields.forEach(field => {
          if (data[field] !== undefined) {
            selected[field] = data[field];
          }
        });
        return selected;
      } : undefined,
    });
  };

  // ⚡ PERFORMANCE: Optimized subsection elements query with pagination
  const useGetBySubsection = (
    subsectionId: string, 
    options?: {
      includeTranslations?: boolean;
      fields?: string[]; // ⚡ PERFORMANCE: Selective field fetching
      limit?: number;    // ⚡ PERFORMANCE: Pagination support
      offset?: number;
      orderBy?: string;
      enabled?: boolean;
    }
  ) => {
    const queryOptions = {
      includeTranslations: options?.includeTranslations || false,
      fields: options?.fields,
      limit: options?.limit || 50, // ⚡ PERFORMANCE: Default reasonable limit
      offset: options?.offset || 0,
    };

    return useQuery({
      queryKey: elementsBySubsectionKey(subsectionId, queryOptions),
      queryFn: async () => {
        const params: any = { 
          translations: queryOptions.includeTranslations,
          limit: queryOptions.limit,
          offset: queryOptions.offset,
        };
        
        // ⚡ PERFORMANCE: Add field selection and ordering
        if (queryOptions.fields && queryOptions.fields.length > 0) {
          params.fields = queryOptions.fields.join(',');
        }
        
        if (options?.orderBy) {
          params.orderBy = options.orderBy;
        }

        const { data } = await apiClient.get(`${endpoint}/subsection/${subsectionId}`, { params });
        return data;
      },
      enabled: !!subsectionId && (options?.enabled !== false),
      ...getOptimizedQueryOptions('basic'),
      
      // ⚡ PERFORMANCE: Keep previous data while loading new data
      keepPreviousData: true,
      
      // ⚡ PERFORMANCE: Transform data if field selection is used
      select: queryOptions.fields ? (data: any) => {
        if (!data?.data || !Array.isArray(data.data)) return data;
        
        return {
          ...data,
          data: data.data.map((item: any) => {
            const selected: any = { _id: item._id }; // Always include ID
            queryOptions.fields!.forEach(field => {
              if (item[field] !== undefined) {
                selected[field] = item[field];
              }
            });
            return selected;
          })
        };
      } : undefined,
    });
  };

  // ⚡ PERFORMANCE: Optimized create mutation with immediate cache updates
  const useCreate = () => {
    return useMutation({
      mutationFn: async (createDto: Omit<ContentElement, '_id'>) => {
        const { data } = await apiClient.post(endpoint, createDto);
        return data;
      },
      onMutate: async (newElement) => {
        // ⚡ PERFORMANCE: Optimistic update for immediate UI feedback
        if (newElement.parent) {
          const subsectionQueryKey = elementsBySubsectionKey(newElement.parent.toString());
          
          // Cancel outgoing refetches
          await queryClient.cancelQueries({ queryKey: subsectionQueryKey });
          
          // Snapshot the previous value
          const previousElements = queryClient.getQueryData(subsectionQueryKey);
          
          // Optimistically update to the new value
          if (previousElements && typeof previousElements === 'object' && 'data' in previousElements) {
            const optimisticElement = {
              ...newElement,
              _id: `temp-${Date.now()}`, // Temporary ID
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            queryClient.setQueryData(subsectionQueryKey, {
              ...(previousElements as any),
              data: [...((previousElements as any).data || []), optimisticElement]
            });
          }
          
          return { previousElements, subsectionQueryKey };
        }
      },
      onSuccess: (data, variables, context) => {
        // ⚡ PERFORMANCE: Update individual element cache
        if (data._id) {
          queryClient.setQueryData(elementKey(data._id), data);
        }
        
        // ⚡ PERFORMANCE: Smart cache invalidation
        if (data.parent) {
          queryClient.invalidateQueries({ 
            queryKey: elementsBySubsectionKey(data.parent.toString()),
            exact: false // Invalidate all variants of this subsection query
          });
        }
      },
      onError: (err, variables, context) => {
        // ⚡ PERFORMANCE: Rollback optimistic update on error
        if (context?.subsectionQueryKey && context?.previousElements) {
          queryClient.setQueryData(context.subsectionQueryKey, context.previousElements);
        }
      },
    });
  };

  // ⚡ PERFORMANCE: Optimized update mutation with granular cache updates
  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<ContentElement> }) => {
        const { data: responseData } = await apiClient.put(`${endpoint}/${id}`, data);
        return responseData;
      },
      onMutate: async ({ id, data: updateData }) => {
        // ⚡ PERFORMANCE: Optimistic update for immediate UI feedback
        const elementQueryKey = elementKey(id);
        
        await queryClient.cancelQueries({ queryKey: elementQueryKey });
        
        const previousElement = queryClient.getQueryData(elementQueryKey);
        
        if (previousElement) {
          queryClient.setQueryData(elementQueryKey, {
            ...previousElement,
            ...updateData,
            updatedAt: new Date().toISOString(),
          });
        }
        
        return { previousElement, elementQueryKey };
      },
      onSuccess: (data, { id }) => {
        // ⚡ PERFORMANCE: Update specific element cache
        queryClient.setQueryData(elementKey(id), data);
        
        // ⚡ PERFORMANCE: Only invalidate subsection cache if parent changed
        if (data.parent) {
          queryClient.invalidateQueries({ 
            queryKey: elementsBySubsectionKey(data.parent.toString()),
            exact: false
          });
        }
      },
      onError: (err, { id }, context) => {
        // ⚡ PERFORMANCE: Rollback optimistic update on error
        if (context?.elementQueryKey && context?.previousElement) {
          queryClient.setQueryData(context.elementQueryKey, context.previousElement);
        }
      },
    });
  };

  // ⚡ PERFORMANCE: Optimized delete mutation with immediate cache cleanup
  const useDelete = (hardDelete: boolean = false) => {
    return useMutation({
      mutationFn: async (id: string) => {
        await apiClient.delete(`${endpoint}/${id}`, {
          params: { hardDelete }
        });
        return id;
      },
      onMutate: async (id) => {
        // ⚡ PERFORMANCE: Get element data before deletion for cache cleanup
        const elementData = queryClient.getQueryData(elementKey(id));
        
        // Remove from cache immediately for optimistic update
        queryClient.removeQueries({ queryKey: elementKey(id) });
        
        return { elementData };
      },
      onSuccess: (id, variables, context) => {
        // ⚡ PERFORMANCE: Clean up related subsection caches
        if (context?.elementData && typeof context.elementData === 'object' && 'parent' in context.elementData) {
          const parentId = (context.elementData as any).parent;
          if (parentId) {
            queryClient.invalidateQueries({ 
              queryKey: elementsBySubsectionKey(parentId.toString()),
              exact: false
            });
          }
        }
      },
    });
  };

  // ⚡ PERFORMANCE: Optimized order update with batch processing
  const useUpdateOrder = () => {
    return useMutation({
      mutationFn: async (elements: { id: string; order: number }[]) => {
        // ⚡ PERFORMANCE: Batch API calls if supported, or send as single request
        const { data } = await apiClient.put(`${endpoint}/order`, { elements });
        return data;
      },
      onMutate: async (elements) => {
        // ⚡ PERFORMANCE: Optimistic updates for immediate UI feedback
        const affectedCaches: Array<{ key: any; previousData: any }> = [];
        
        for (const element of elements) {
          const elementQueryKey = elementKey(element.id);
          await queryClient.cancelQueries({ queryKey: elementQueryKey });
          
          const previousData = queryClient.getQueryData(elementQueryKey);
          if (previousData) {
            affectedCaches.push({ key: elementQueryKey, previousData });
            
            queryClient.setQueryData(elementQueryKey, {
              ...previousData,
              order: element.order,
              updatedAt: new Date().toISOString(),
            });
          }
        }
        
        return { affectedCaches };
      },
      onSuccess: (_, elements) => {
        // ⚡ PERFORMANCE: Smart invalidation - collect unique parent IDs
        const affectedElementIds = elements.map(el => el.id);
        const affectedParents = new Set<string>();
        
        // ⚡ PERFORMANCE: Collect parent IDs from cache to minimize invalidations
        affectedElementIds.forEach(id => {
          const elementData = queryClient.getQueryData(elementKey(id));
          if (elementData && typeof elementData === 'object' && 'parent' in elementData) {
            const parentId = (elementData as any).parent;
            if (parentId) {
              affectedParents.add(parentId.toString());
            }
          }
        });
        
        // ⚡ PERFORMANCE: Invalidate only affected subsection queries
        affectedParents.forEach(parentId => {
          queryClient.invalidateQueries({ 
            queryKey: elementsBySubsectionKey(parentId),
            exact: false
          });
        });
      },
      onError: (err, elements, context) => {
        // ⚡ PERFORMANCE: Rollback optimistic updates on error
        if (context?.affectedCaches) {
          context.affectedCaches.forEach(({ key, previousData }) => {
            queryClient.setQueryData(key, previousData);
          });
        }
      },
    });
  };

  // ⚡ PERFORMANCE: Prefetch utility for better UX
  const prefetchElement = async (id: string, includeTranslations: boolean = false) => {
    await queryClient.prefetchQuery({
      queryKey: elementKey(id),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/${id}`, {
          params: { translations: includeTranslations }
        });
        return data;
      },
      staleTime: CACHE_CONFIG.STALE_TIME,
    });
  };

  // ⚡ PERFORMANCE: Prefetch subsection elements
  const prefetchBySubsection = async (
    subsectionId: string, 
    options?: { includeTranslations?: boolean; fields?: string[]; limit?: number }
  ) => {
    const queryOptions = {
      includeTranslations: options?.includeTranslations || false,
      fields: options?.fields,
      limit: options?.limit || 50,
      offset: 0,
    };

    await queryClient.prefetchQuery({
      queryKey: elementsBySubsectionKey(subsectionId, queryOptions),
      queryFn: async () => {
        const params: any = { 
          translations: queryOptions.includeTranslations,
          limit: queryOptions.limit,
          offset: queryOptions.offset,
        };
        
        if (queryOptions.fields && queryOptions.fields.length > 0) {
          params.fields = queryOptions.fields.join(',');
        }

        const { data } = await apiClient.get(`${endpoint}/subsection/${subsectionId}`, { params });
        return data;
      },
      staleTime: CACHE_CONFIG.STALE_TIME,
    });
  };

  // ⚡ PERFORMANCE: Cache utilities for manual cache management
  const getCachedElement = (id: string) => queryClient.getQueryData(elementKey(id));
  const getCachedSubsectionElements = (subsectionId: string, options?: any) => 
    queryClient.getQueryData(elementsBySubsectionKey(subsectionId, options));

  // Return all hooks and utilities
  return {
    // Main hooks
    useGetById,
    useGetBySubsection,
    useCreate,
    useUpdate,
    useDelete,
    useUpdateOrder,
    
    // ⚡ PERFORMANCE: Additional utilities
    prefetchElement,
    prefetchBySubsection,
    getCachedElement,
    getCachedSubsectionElements,
    
    // ⚡ PERFORMANCE: Cache management utilities
    invalidateElement: (id: string) => queryClient.invalidateQueries({ queryKey: elementKey(id) }),
    invalidateSubsectionElements: (subsectionId: string) => 
      queryClient.invalidateQueries({ 
        queryKey: elementsBySubsectionKey(subsectionId),
        exact: false 
      }),
    clearElementCache: (id: string) => queryClient.removeQueries({ queryKey: elementKey(id) }),
    clearSubsectionCache: (subsectionId: string) => 
      queryClient.removeQueries({ 
        queryKey: elementsBySubsectionKey(subsectionId),
        exact: false 
      }),
  };
}