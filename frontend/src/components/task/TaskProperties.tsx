import type { Task } from '@/types';

interface TaskPropertiesProps {
  task: Task;
}

export default function TaskProperties({
  task,
}: TaskPropertiesProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold">
        Properties
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {task.project && (
          <span className="rounded-full border px-3 py-1 text-xs">
            {task.project.name}
          </span>
        )}

        <span className="rounded-full border px-3 py-1 text-xs">
          {task.status}
        </span>

        <span className="rounded-full border px-3 py-1 text-xs">
          {task.priority}
        </span>

        {task.labels?.map((label) => (
          <span
            key={label}
            className="rounded-full border px-3 py-1 text-xs"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}