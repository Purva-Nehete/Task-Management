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
  Subtask,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/types';

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
  userId: number,
): Promise<Comment> {
  return api.post<Comment>(
    `/tasks/${taskId}/comments`,
    {
      content,
      userId,
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
