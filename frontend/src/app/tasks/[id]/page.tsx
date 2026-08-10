interface TaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskPage({
  params,
}: TaskPageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Task {id}</h1>
    </main>
  );
}