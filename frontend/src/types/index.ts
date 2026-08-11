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

  createdAt: string;
  updatedAt: string;

  tasks?: Task[];
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

  subtasks?: Subtask[];
  comments?: Comment[];

  labels?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  priority?: TaskPriority;
  dueDate?: string | null;
  taskId: number;
  assigneeId?: number | null;
  assignee?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  user?: User;
  createdAt: string;
  updatedAt: string;
}