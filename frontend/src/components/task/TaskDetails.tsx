import type { Task } from '@/types';

interface TaskDetailsProps {
  task: Task;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="text-xs text-gray-500">
        {label}
      </div>

      <div className="mt-1 text-sm">
        {children}
      </div>
    </div>
  );
}

export default function TaskDetails({
  task,
}: TaskDetailsProps) {
  return (
    <aside className="rounded-xl border bg-white p-5">
      <div className="mb-2 text-sm font-semibold">
        Details
      </div>

      <DetailRow label="Status">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">
          {task.status}
        </span>
      </DetailRow>

      <DetailRow label="Priority">
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-600">
          {task.priority}
        </span>
      </DetailRow>

      <DetailRow label="Reporter">
        {task.reporter?.name ??
          task.reporter?.username ??
          'Not assigned'}
      </DetailRow>

      <DetailRow label="Project">
        {task.project?.name ??
          'No project'}
      </DetailRow>

      <DetailRow label="Due Date">
        {task.dueDate
          ? new Date(
              task.dueDate,
            ).toLocaleDateString()
          : 'No due date'}
      </DetailRow>

      <DetailRow label="Members">
        {task.members &&
        task.members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {task.members.map(
              (member, index) => (
                <span
                  key={
                    member.id ??
                    member.email ??
                    `member-${index}`
                  }
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs"
                >
                  {member.name ??
                    member.username ??
                    'User'}
                </span>
              ),
            )}
          </div>
        ) : (
          'No members'
        )}
      </DetailRow>
    </aside>
  );
}