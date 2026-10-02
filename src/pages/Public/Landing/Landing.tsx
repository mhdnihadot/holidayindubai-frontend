import React, { useEffect, useState } from 'react';
import { projectService, type Project } from '@/services/project.service';
import SearchBar from '@/components/ui/SearchBar';
import MobileSearchBar from '@/components/ui/MobileSearchBar';
import CategoryFilter from '@/components/ui/CategoryFilter';
import EmirateFilter from '@/components/ui/EmirateFilter';
import GroupedExperiences from '@/components/ui/GroupedExperiences';
import { GroupedExperiencesSkeleton } from '@/components/ui/GroupedExperiencesSkeleton';

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
      <div className="hidden md:block">
        <SearchBar />
      </div>
      <div className="md:hidden">
        <MobileSearchBar />
      </div>
      <CategoryFilter />
      <EmirateFilter />


      {isLoading ? (
        <GroupedExperiencesSkeleton />
      ) : (
        <GroupedExperiences projects={projects} />
      )}

    </div>
  );
};

export default Landing;
