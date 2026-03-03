'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export type Project = {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  };
};

export const useProjects = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery<Project[]>({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const data = await api.getProjects(workspaceId);
      return data;
    },
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => api.createProject(workspaceId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] });
    },
    onError: (err: Error) => {
      console.error('[createProject] ✗', err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => api.deleteProject(workspaceId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] });
    },
    onError: (err: Error) => {
      console.error('[deleteProject] ✗', err.message);
    },
  });

  return { projectsQuery, createMutation, deleteMutation };
};