import React, { useEffect, useState } from 'react';
import { projectService, type Project } from '@/services/project.service';
import SearchBar from '@/components/ui/SearchBar';
import CategoryFilter from '@/components/ui/CategoryFilter';
import EmirateFilter from '@/components/ui/EmirateFilter';
import GroupedExperiences from '@/components/ui/GroupedExperiences';
import { ProjectCardSkeleton } from '@/components/ui/ProjectCardSkeleton';

const Landing: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAll();
        // Assuming response.data is the array of projects
        const fetchedProjects = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="w-full">
      <SearchBar />
      <CategoryFilter />
      <EmirateFilter />


      {isLoading ? (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <GroupedExperiences projects={projects} />
      )}

    </div>
  );
};

export default Landing;
