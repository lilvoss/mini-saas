'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api'; // ✅ même instance axios, token JWT déjà injecté

export type Notification = {
  id:            string;
  type:          string;
  title:         string;
  body:          string;
  taskId?:       string;
  projectId?:    string;
  workspaceId?:  string;
  projectName?:  string;
  workspaceName?: string;
  read:          boolean;
  createdAt:     string;
};

const fetchNotifications = (): Promise<Notification[]> =>
  api.get('/notifications').then(r => r.data);

const fetchUnreadCount = (): Promise<{ count: number }> =>
  api.get('/notifications/unread-count').then(r => r.data);

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn:  fetchNotifications,
    refetchInterval: 15_000,
  });

  const unreadQuery = useQuery<{ count: number }>({
    queryKey: ['notifications', 'unread'],
    queryFn:  fetchUnreadCount,
    refetchInterval: 15_000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notificationsQuery,
    unreadCount: unreadQuery.data?.count ?? 0,
    markRead:    (id: string) => markReadMutation.mutateAsync(id),
    markAllRead: () => markAllReadMutation.mutateAsync(),
  };
};