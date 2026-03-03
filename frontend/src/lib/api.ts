import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({ baseURL: BASE_URL });

// Injecte le token dans chaque requête automatiquement
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const register = (fullName: string, email: string, password: string) =>
  api.post('/auth/register', { fullName, email, password }).then((r) => r.data);

export const getProfile = (token: string) =>
  api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);

// ── Users search (via workspace route) ────────────────────────────────────
export const searchUsers = (query: string) =>
  api.get('/workspaces/users/search', { params: { q: query } }).then((r) => r.data);

// ── Workspaces ──────────────────────────────────────────────────────────────
export const createWorkspace = (name: string) =>
  api.post('/workspaces', { name }).then((r) => r.data);

export const getMyWorkspaces = () =>
  api.get('/workspaces').then((r) => r.data);

export const addMemberToWorkspace = (
  workspaceId: string,
  userId: string,
  role: 'ADMIN' | 'MEMBER' | 'VIEWER',
) =>
  api.post(`/workspaces/${workspaceId}/members`, { userId, role }).then((r) => r.data);

// ── Projects ────────────────────────────────────────────────────────────────
export const getProjects = (workspaceId: string) =>
  api.get(`/workspaces/${workspaceId}/projects`).then((r) => r.data);

export const createProject = (workspaceId: string, name: string) =>
  api.post(`/workspaces/${workspaceId}/projects`, { name }).then((r) => r.data);

export const deleteProject = (workspaceId: string, projectId: string) =>
  api.delete(`/workspaces/${workspaceId}/projects/${projectId}`).then((r) => r.data);

// ── Tasks ────────────────────────────────────────────────────────────────────
export const getTasks = (workspaceId: string, projectId: string) =>
  api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`).then(r => r.data);

export const createTask = (workspaceId: string, projectId: string, body: {
  title: string; description?: string; priority?: string; dueDate?: string;
}) =>
  api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, body).then(r => r.data);

export const updateTask = (workspaceId: string, projectId: string, taskId: string, body: {
  title?: string; description?: string; status?: string; priority?: string; dueDate?: string;
}) =>
  api.patch(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, body).then(r => r.data);

export const deleteTask = (workspaceId: string, projectId: string, taskId: string) =>
  api.delete(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`).then(r => r.data);

export const assignTask = (workspaceId: string, projectId: string, taskId: string, memberUserId: string) =>
  api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assign`, { memberUserId }).then(r => r.data);

export const getWorkspaceMembers = (workspaceId: string) =>
  api.get(`/workspaces/${workspaceId}/members`).then(r => r.data);