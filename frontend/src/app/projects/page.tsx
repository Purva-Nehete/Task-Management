'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import CreateProjectModal from '@/components/projects/CreateProjectModal';
import DeleteProjectModal from '@/components/projects/DeleteProjectModal';
import EditProjectModal from '@/components/projects/EditProjectModal';
import ProjectTable from '@/components/projects/ProjectTable';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '@/lib/api';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, []);

  async function handleCreateProject(name: string, description: string) {
    const project = await createProject({ name, description });
    setProjects((current) => [project, ...current]);
  }

  async function handleUpdateProject(name: string, description: string) {
    if (!selectedProject) {
      return;
    }

    const updated = await updateProject(selectedProject.id, { name, description });
    setProjects((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedProject(updated);
  }

  async function handleDeleteProject() {
    if (!selectedProject) {
      return;
    }

    await deleteProject(selectedProject.id);
    setProjects((current) => current.filter((item) => item.id !== selectedProject.id));
    setDeleteOpen(false);
    setSelectedProject(null);
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading projects...</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your projects</p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none"
        />
      </div>

      <ProjectTable
        projects={filteredProjects}
        onEdit={(project) => {
          setSelectedProject(project);
          setEditOpen(true);
        }}
        onDelete={(project) => {
          setSelectedProject(project);
          setDeleteOpen(true);
        }}
      />

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (name, description) => {
          await handleCreateProject(name, description);
          setCreateOpen(false);
        }}
      />

      <EditProjectModal
        open={editOpen}
        project={selectedProject}
        onClose={() => {
          setEditOpen(false);
          setSelectedProject(null);
        }}
        onUpdate={async (name, description) => {
          await handleUpdateProject(name, description);
          setEditOpen(false);
          setSelectedProject(null);
        }}
      />

      <DeleteProjectModal
        open={deleteOpen}
        project={selectedProject}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={async () => {
          await handleDeleteProject();
        }}
      />
    </div>
  );
}