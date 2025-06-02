// src/hooks/webConfiguration/use-WebSiteTheme.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';
import {
  CreateWebSiteThemeDto,
  UpdateWebSiteThemeDto,
  WebSiteTheme,
} from '@/api/types/WebSite/useWebSiteTheme';

// WebSite Theme hook
export function useWebSiteThemes() {
  const queryClient = useQueryClient();
  const endpoint = '/themes';

  // Get user ID from auth context, fallback to hardcoded ID for compatibility
  const userId =  '683b23edd6fa6b23f0af8099';

  // Query keys include user ID to prevent cross-user cache conflicts
  const themesKey = ['themes', userId];
  const themeKey = (id: string) => [...themesKey, id];
  const websiteThemesKey = (websiteId: string) => [...themesKey, 'website', websiteId];
  const activeThemeKey = (websiteId: string) => [...themesKey, 'website', websiteId, 'active'];

  // Get all themes (admin function - paginated)
  const useGetAll = (options?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();

    if (options?.page) {
      queryParams.append('page', options.page.toString());
    }

    if (options?.limit) {
      queryParams.append('limit', options.limit.toString());
    }

    const queryKey = options
      ? [...themesKey, 'all', JSON.stringify(options)]
      : [...themesKey, 'all'];

    return useQuery({
      queryKey,
      queryFn: async () => {
        const url = queryParams.toString()
          ? `${endpoint}/admin/all?${queryParams.toString()}`
          : `${endpoint}/admin/all`;
        const { data } = await apiClient.get(url);
        return data; // Returns { success, message, data: WebSiteTheme[] }
      },
      staleTime: 30 * 1000,
      retry: 2,
      retryDelay: 1000,
    });
  };

  // Get all themes for a specific website
  const useGetByWebsite = (websiteId: string) => {
    return useQuery({
      queryKey: websiteThemesKey(websiteId),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/website/${websiteId}`);
        return data; // Returns { success, message, data: WebSiteTheme[] }
      },
      enabled: !!websiteId,
      staleTime: 30 * 1000,
      retry: 2,
      retryDelay: 1000,
    });
  };

  // Get active theme for a specific website
  const useGetActiveTheme = (
    websiteId: string,
    options: {
      enabled?: boolean;
      retry?: number;
      onError?: (err: any) => void;
      onSuccess?: (data: { success: boolean; message: string; data: WebSiteTheme }) => void;
    } = {}
  ) => {
    return useQuery({
      queryKey: activeThemeKey(websiteId),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/active/${websiteId}`);
        return data; // Returns { success, message, data: WebSiteTheme }
      },
      enabled: options.enabled ?? !!websiteId,
      staleTime: 30 * 1000,
      retry: options.retry ?? 2,
      retryDelay: 1000,
      onError: options.onError,
      onSuccess: options.onSuccess,
    });
  };

  // Get a single theme by ID
  const useGetById = (id: string) => {
    return useQuery({
      queryKey: themeKey(id),
      queryFn: async () => {
        const { data } = await apiClient.get(`${endpoint}/${id}`);
        return data; // Returns { success, message, data: WebSiteTheme }
      },
      enabled: !!id,
      staleTime: 30 * 1000,
      retry: 2,
      retryDelay: 1000,
    });
  };

  // Create a new theme
  const useCreate = () => {
    return useMutation({
      mutationFn: async (createDto: CreateWebSiteThemeDto) => {
        const { data } = await apiClient.post(endpoint, createDto);
        return data; // Returns { success, message, data: WebSiteTheme }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [...themesKey, 'all'] });

        if (data.data?.websiteId) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(data.data.websiteId.toString()),
          });

          if (data.data.isActive) {
            queryClient.setQueryData(activeThemeKey(data.data.websiteId.toString()), data);
          }
        }

        if (data.data?._id) {
          queryClient.setQueryData(themeKey(data.data._id.toString()), data);
        }
      },
      onError: (error: any) => {
        console.error('Error creating theme:', error.message);
      },
    });
  };

  // Update a theme
  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: UpdateWebSiteThemeDto }) => {
        const { data: responseData } = await apiClient.patch(`${endpoint}/${id}`, data);
        return responseData; // Returns { success, message, data: WebSiteTheme }
      },
      onSuccess: (data, { id }) => {
        queryClient.setQueryData(themeKey(id), data);
        queryClient.invalidateQueries({ queryKey: [...themesKey, 'all'] });

        if (data.data?.websiteId) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(data.data.websiteId.toString()),
          });

          if (data.data.isActive) {
            queryClient.setQueryData(activeThemeKey(data.data.websiteId.toString()), data);
          }
        }

        const previousTheme = queryClient.getQueryData<{
          data: { websiteId: string };
        }>(themeKey(id));
        if (
          previousTheme?.data?.websiteId &&
          previousTheme.data.websiteId !== data.data?.websiteId
        ) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(previousTheme.data.websiteId),
          });
          queryClient.invalidateQueries({
            queryKey: activeThemeKey(previousTheme.data.websiteId),
          });
        }
      },
    });
  };

  // Update theme colors only
  const useUpdateColors = () => {
    return useMutation({
      mutationFn: async ({
        id,
        colors,
      }: {
        id: string;
        colors: Partial<WebSiteTheme['colors']>;
      }) => {
        const { data: responseData } = await apiClient.patch(`${endpoint}/colors/${id}`, {
          colors,
        });
        return responseData; // Returns { success, message, data: WebSiteTheme }
      },
      onSuccess: (data, { id }) => {
        queryClient.setQueryData(themeKey(id), data);

        if (data.data?.websiteId) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(data.data.websiteId.toString()),
          });

          if (data.data.isActive) {
            queryClient.setQueryData(activeThemeKey(data.data.websiteId.toString()), data);
          }
        }
      },
    });
  };

  // Update theme fonts only
  const useUpdateFonts = () => {
    return useMutation({
      mutationFn: async ({
        id,
        fonts,
      }: {
        id: string;
        fonts: Partial<WebSiteTheme['fonts']>;
      }) => {
        const { data: responseData } = await apiClient.patch(`${endpoint}/fonts/${id}`, {
          fonts,
        });
        return responseData; // Returns { success, message, data: WebSiteTheme }
      },
      onSuccess: (data, { id }) => {
        queryClient.setQueryData(themeKey(id), data);

        if (data.data?.websiteId) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(data.data.websiteId.toString()),
          });

          if (data.data.isActive) {
            queryClient.setQueryData(activeThemeKey(data.data.websiteId.toString()), data);
          }
        }
      },
    });
  };

  // Set active theme
  const useSetActiveTheme = () => {
    return useMutation({
      mutationFn: async ({ websiteId, themeId }: { websiteId: string; themeId: string }) => {
        const { data: responseData } = await apiClient.post(
          `${endpoint}/set-active/${websiteId}/${themeId}`
        );
        return responseData; // Returns { success, message, data: WebSiteTheme }
      },
      onSuccess: (data, { websiteId, themeId }) => {
        queryClient.setQueryData(themeKey(themeId), data);
        queryClient.setQueryData(activeThemeKey(websiteId), data);
        queryClient.invalidateQueries({
          queryKey: websiteThemesKey(websiteId),
        });
        queryClient.invalidateQueries({ queryKey: [...themesKey, 'all'] });
      },
    });
  };

  // Clone theme
  const useCloneTheme = () => {
    return useMutation({
      mutationFn: async ({ id, themeName }: { id: string; themeName: string }) => {
        const { data: responseData } = await apiClient.post(`${endpoint}/clone/${id}`, {
          themeName,
        });
        return responseData; // Returns { success, message, data: WebSiteTheme }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [...themesKey, 'all'] });

        if (data.data?.websiteId) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(data.data.websiteId.toString()),
          });
        }

        if (data.data?._id) {
          queryClient.setQueryData(themeKey(data.data._id.toString()), data);
        }
      },
    });
  };

  // Delete a theme
  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { data } = await apiClient.get(`${endpoint}/${id}`);
        const websiteId = data?.data?.websiteId?.toString();
        const isActive = data?.data?.isActive;

        await apiClient.delete(`${endpoint}/${id}`);

        return { websiteId, isActive };
      },
      onSuccess: ({ websiteId, isActive }, id) => {
        queryClient.removeQueries({ queryKey: themeKey(id) });
        queryClient.invalidateQueries({ queryKey: [...themesKey, 'all'] });

        if (websiteId) {
          queryClient.invalidateQueries({
            queryKey: websiteThemesKey(websiteId),
          });

          if (isActive) {
            queryClient.invalidateQueries({
              queryKey: activeThemeKey(websiteId),
            });
          }
        }
      },
    });
  };

  // Batch operations for themes
  const useBatchUpdateStatuses = () => {
    return useMutation({
      mutationFn: async (updates: { id: string; isActive: boolean }[]) => {
        const { data: responseData } = await apiClient.post(`${endpoint}/batch-update`, {
          updates,
        });
        return responseData; // Returns { success, message, data: WebSiteTheme[] }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: themesKey });
      },
    });
  };

  // Bulk delete themes
  const useBulkDelete = () => {
    return useMutation({
      mutationFn: async (ids: string[]) => {
        const { data: responseData } = await apiClient.post(`${endpoint}/bulk-delete`, {
          ids,
        });
        return responseData; // Returns { success, message, data: any }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: themesKey });
      },
    });
  };

  return {
    useGetAll,
    useGetByWebsite,
    useGetActiveTheme,
    useGetById,
    useCreate,
    useUpdate,
    useUpdateColors,
    useUpdateFonts,
    useSetActiveTheme,
    useCloneTheme,
    useDelete,
    useBatchUpdateStatuses,
    useBulkDelete,
  };
}