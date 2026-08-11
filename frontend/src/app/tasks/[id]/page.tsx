'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import TaskHeader from '@/components/task/TaskHeader';
import TaskDescription from '@/components/task/TaskDescription';
import TaskProperties from '@/components/task/TaskProperties';
import TaskDetails from '@/components/task/TaskDetails';
import SubtasksTable from '@/components/task/SubtasksTable';
import Comments from '@/components/task/Comments';
import Calendar from '@/components/task/Calendar';
import EditTaskModal from '@/components/task/EditTaskModal';

import {
  createComment,
  createSubtask,
  deleteComment,
  deleteTask,
  deleteSubtask,
  getComments,
  getTask,
  updateSubtask,
  updateTask,
} from '@/lib/api';

import type {
  Comment as TaskComment,
  Subtask,
  Task,
} from '@/types';

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [task, setTask] =
    useState<Task | null>(null);

  const [comments, setComments] =
    useState<TaskComment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  /*
   * Replace this later with the
   * authenticated/current user.
   */
  const currentUserId = 1;

  useEffect(() => {
    async function loadTask() {
      try {
        setLoading(true);

        const [taskData, commentData] =
          await Promise.all([
            getTask(id),
            getComments(id),
          ]);

        setTask(taskData);
        setComments(commentData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load task',
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTask();
    }
  }, [id]);

  async function handleUpdateTask(
    data: Partial<Task>,
  ) {
    if (!task) {
      return;
    }

    const updated = await updateTask(
      task.id,
      {
        title: data.title,
        description:
          data.description ?? undefined,
        status: data.status,
        priority: data.priority,
      },
    );

    setTask(updated);
  }

  async function handleCreateSubtask(
    title: string,
  ) {
    if (!task) {
      return;
    }

    const subtask =
      await createSubtask(task.id, {
        title,
        completed: false,
      });

    setTask((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        subtasks: [
          ...(current.subtasks ?? []),
          subtask,
        ],
      };
    });
  }

  async function handleDeleteSubtask(
    subtaskId: number,
  ) {
    await deleteSubtask(subtaskId);

    setTask((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        subtasks: (
          current.subtasks ?? []
        ).filter(
          (subtask) =>
            subtask.id !== subtaskId,
        ),
      };
    });
  }

  async function handleToggleSubtask(
    subtask: Subtask,
  ) {
    const newStatus =
      !subtask.completed;

    const updated =
      await updateSubtask(subtask.id, {
        completed: newStatus,
      });

    setTask((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        subtasks: (
          current.subtasks ?? []
        ).map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      };
    });
  }

  async function handleCreateComment(
    content: string,
  ) {
    const comment =
      await createComment(
        id,
        content,
        currentUserId,
      );

    setComments((current) => [
      ...current,
      comment,
    ]);
  }

  async function handleDeleteComment(
    commentId: number,
  ) {
    await deleteComment(commentId);

    setComments((current) =>
      current.filter(
        (comment) =>
          comment.id !== commentId,
      ),
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
        Loading task...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error ?? 'Task not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskHeader
        title={task.title}
        projectName={task.project?.name}
        onEdit={() => setEditOpen(true)}
        onDelete={async () => {
          const confirmed = window.confirm(
            'Are you sure you want to delete this task?',
          );

          if (!confirmed) {
            return;
          }

          await deleteTask(task.id);
          router.push('/dashboard');
        }}
      />

      <TaskProperties task={task} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-6">
          <TaskDescription
            description={task.description}
          />

          <SubtasksTable
            subtasks={task.subtasks ?? []}
            onCreate={handleCreateSubtask}
            onDelete={handleDeleteSubtask}
            onToggle={handleToggleSubtask}
          />

          <Comments
            comments={comments}
            currentUserId={currentUserId}
            onCreate={handleCreateComment}
            onDelete={handleDeleteComment}
          />

          <EditTaskModal
            task={task}
            open={editOpen}
            onClose={() => setEditOpen(false)}
            onSave={handleUpdateTask}
          />
        </main>

        <aside className="space-y-6">
          <TaskDetails task={task} />

          <Calendar
            dueDate={task.dueDate}
          />
        </aside>
      </div>
    </div>
  );
}