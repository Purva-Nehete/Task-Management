'use client';

import { useState } from 'react';

import {
  MessageCircle,
  Send,
  Trash2,
} from 'lucide-react';

import type { Comment } from '@/types';

interface CommentsProps {
  comments: Comment[];
  currentUserId: number;
  onCreate: (
    content: string,
  ) => Promise<void>;
  onDelete: (
    id: number,
  ) => Promise<void>;
}

export default function Comments({
  comments,
  currentUserId,
  onCreate,
  onDelete,
}: CommentsProps) {
  const [content, setContent] =
    useState('');

  async function handleSubmit() {
    if (!content.trim()) {
      return;
    }

    await onCreate(content.trim());
    setContent('');
  }

  return (
    <section>
      <div className="flex items-center gap-2">
        <MessageCircle size={17} />

        <h2 className="text-sm font-semibold">
          Comments
        </h2>
      </div>

      <div className="mt-3 space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {comment.user?.name ??
                  comment.user?.username ??
                  'User'}
              </div>

              {comment.userId ===
                currentUserId && (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(comment.id)
                  }
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
              {comment.content}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {new Date(
                comment.createdAt,
              ).toLocaleString()}
            </p>
          </div>
        ))}

        <div className="flex items-end gap-2 rounded-xl border bg-white p-3">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Add a comment..."
            rows={3}
            className="flex-1 resize-none text-sm outline-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-black p-2 text-white"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}