const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ||
        `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}

export const api = {
  get<T>(endpoint: string) {
    return request<T>(endpoint);
  },

  post<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  patch<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, {
      method: 'DELETE',
    });
  },
};

import type {
  Comment,
  Project,
  Subtask,
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from '@/types';

export interface AuthResponse {
  user: User;
}

export function login(identifier: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', { identifier, password });
}

export function guestLogin(): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/guest', {});
}

export function logout(): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>('/auth/logout', {});
}

export function getCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId: number;
  reporterId: number;
  memberIds?: number[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: number;
  reporterId?: number;
  memberIds?: number[];
}

export async function getProjects(): Promise<Project[]> {
  return api.get<Project[]>('/projects');
}

export async function getProject(id: number): Promise<Project> {
  return api.get<Project>(`/projects/${id}`);
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  return api.post<Project>('/projects', data);
}

export async function updateProject(id: number, data: Partial<CreateProjectInput>): Promise<Project> {
  return api.patch<Project>(`/projects/${id}`, data);
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/projects/${id}`);
}

export async function getUser(id: number): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

export async function getUsers(): Promise<User[]> {
  return api.get<User[]>('/users');
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  return api.patch<User>(`/users/${id}`, data);
}

export async function getTasks(): Promise<Task[]> {
  return api.get<Task[]>('/tasks');
}

export async function getTask(
  id: number,
): Promise<Task> {
  return api.get<Task>(`/tasks/${id}`);
}

export async function createTask(
  data: CreateTaskInput,
): Promise<Task> {
  return api.post<Task>('/tasks', data);
}

export async function updateTask(
  id: number,
  data: UpdateTaskInput,
): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}`, data);
}

export async function deleteTask(
  id: number,
): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export interface CreateSubtaskInput {
  title: string;
  completed?: boolean;
}

export async function createSubtask(
  taskId: number,
  data: CreateSubtaskInput,
): Promise<Subtask> {
  return api.post<Subtask>(
    `/tasks/${taskId}/subtasks`,
    data,
  );
}

export async function updateSubtask(
  id: number,
  data: Partial<CreateSubtaskInput>,
): Promise<Subtask> {
  return api.patch<Subtask>(
    `/subtasks/${id}`,
    data,
  );
}

export async function deleteSubtask(
  id: number,
): Promise<void> {
  await api.delete(`/subtasks/${id}`);
}

export async function getComments(
  taskId: number,
): Promise<Comment[]> {
  return api.get<Comment[]>(
    `/tasks/${taskId}/comments`,
  );
}

export async function createComment(
  taskId: number,
  content: string,
): Promise<Comment> {
  return api.post<Comment>(
    `/tasks/${taskId}/comments`,
    {
      content,
    },
  );
}

export async function updateComment(
  id: number,
  content: string,
): Promise<Comment> {
  return api.patch<Comment>(
    `/comments/${id}`,
    {
      content,
    },
  );
}

export async function deleteComment(
  id: number,
): Promise<void> {
  await api.delete(`/comments/${id}`);
}
