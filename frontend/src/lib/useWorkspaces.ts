'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export type WorkspaceRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export type Workspace = {
  workspaceId: string;
  name: string;
  role: WorkspaceRole;
};

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  // ── Liste des workspaces de l'utilisateur ──────────────────────────────
  const workspacesQuery = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      console.log('[workspaces] → Récupération');
      const data = await api.getMyWorkspaces();
      console.log('[workspaces] ✓', data);
      return data;
    },
  });

  // ── Créer un workspace ─────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      console.log('[createWorkspace] → Création', { name });
      const data = await api.createWorkspace(name);
      console.log('[createWorkspace] ✓', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (err: Error) => {
      console.error('[createWorkspace] ✗', err.message);
    },
  });

  // ── Ajouter un membre ──────────────────────────────────────────────────
  const addMemberMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
      role,
    }: {
      workspaceId: string;
      userId: string;
      role: WorkspaceRole;
    }) => {
      console.log('[addMember] → Ajout', { workspaceId, userId, role });
      const data = await api.addMemberToWorkspace(workspaceId, userId, role);
      console.log('[addMember] ✓', data);
      return data;
    },
    onError: (err: Error) => {
      console.error('[addMember] ✗', err.message);
    },
  });

  return {
    workspacesQuery,
    createMutation,
    addMemberMutation,
  };
};