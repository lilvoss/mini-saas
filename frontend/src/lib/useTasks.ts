'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export type TaskStatus   = 'TODO' | 'DOING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskAssignee = {
  id: string;
  fullName: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  assignee?: TaskAssignee;
  projectId: string;
  workspaceId: string;
};

export type WorkspaceMember = {
  userId: string;
  role: string;
  user: { id: string; fullName: string; email: string };
};

export const useTasks = (workspaceId: string, projectId: string) => {
  const queryClient = useQueryClient();
  const key = ['tasks', workspaceId, projectId];

  const tasksQuery = useQuery<Task[]>({
    queryKey: key,
    queryFn: () => api.getTasks(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });

  const membersQuery = useQuery<WorkspaceMember[]>({
    queryKey: ['ws-members', workspaceId],
    queryFn: () => api.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: (body: { title: string; description?: string; priority?: string; dueDate?: string }) =>
      api.createTask(workspaceId, projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, ...body }: { taskId: string; status?: string; title?: string; description?: string; priority?: string; dueDate?: string }) =>
      api.updateTask(workspaceId, projectId, taskId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => api.deleteTask(workspaceId, projectId, taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ taskId, memberUserId }: { taskId: string; memberUserId: string }) =>
      api.assignTask(workspaceId, projectId, taskId, memberUserId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  return { tasksQuery, membersQuery, createMutation, updateMutation, deleteMutation, assignMutation };
};