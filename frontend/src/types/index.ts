export type TaskStatus =
  | 'TODO'
  | 'DOING'
  | 'COMPLETED'
  | 'ON_HOLD';

export type TaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  title?: string | null;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  projectId: number;
  reporterId: number;

  project?: Project;
  reporter?: User;
  members?: User[];

  createdAt: string;
  updatedAt: string;
}