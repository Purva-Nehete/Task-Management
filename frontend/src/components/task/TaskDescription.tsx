interface TaskDescriptionProps {
  description?: string | null;
}

export default function TaskDescription({
  description,
}: TaskDescriptionProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold">
        Description
      </h2>

      <div className="mt-3 rounded-xl border bg-white p-5">
        {description ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {description}
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            No description added.
          </p>
        )}
      </div>
    </section>
  );
}