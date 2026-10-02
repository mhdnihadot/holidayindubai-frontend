import { projectService, type Project } from '@/services/project.service';

// In-memory cache so the public details page can render instantly
// (seeded from list pages, warmed on hover) instead of showing a loader.
const cache = new Map<string, Project>();
const inflight = new Map<string, Promise<Project | null>>();

export const getCachedProject = (id?: string): Project | null => (id ? cache.get(id) ?? null : null);

export const seedProjects = (projects: Project[]) => {
  projects.forEach((p) => {
    const key = p.id || (p as any)._id;
    // Don't overwrite a full detail response with a (possibly slimmer) list row
    if (key && !cache.has(key)) cache.set(key, p);
  });
};

export const fetchProject = (id: string): Promise<Project | null> => {
  const pending = inflight.get(id);
  if (pending) return pending;
  const request = projectService
    .getById(id)
    .then((response) => {
      const data: Project = response?.data || response;
      if (data) cache.set(id, data);
      return data ?? null;
    })
    .finally(() => inflight.delete(id));
  inflight.set(id, request);
  return request;
};

export const prefetchProject = (id?: string) => {
  if (id) fetchProject(id).catch(() => {});
};
