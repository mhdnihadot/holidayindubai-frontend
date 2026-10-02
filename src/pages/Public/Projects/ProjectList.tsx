import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { projectService, type Project } from '@/services/project.service';
import { ChevronRight, Compass, X } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { seedProjects } from '@/services/projectCache';
import { ExperienceCard, ExperienceCardSkeleton } from '@/components/ui/ExperienceCard';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const emirateParam = searchParams.get('emirate');
  const categoryParam = searchParams.get('category');

  // Load user's wishlist on mount and listen to storage events
  useEffect(() => {
    const loadWishlist = () => {
      const userStr = localStorage.getItem('userUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.wishlist) {
            setWishlist(user.wishlist.map((w: any) => typeof w === 'string' ? w : w._id || w.id));
          }
        } catch (e) {
          console.error('Error parsing user data for wishlist', e);
        }
      }
    };

    loadWishlist();
    window.addEventListener('storage', loadWishlist);

    return () => {
      window.removeEventListener('storage', loadWishlist);
    };
  }, []);

  const toggleWishlist = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault(); // Prevent navigating to project details
    e.stopPropagation();

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      alert("Please log in to save properties to your wishlist.");
      return;
    }

    try {
      // Optimistic UI update
      const isInWishlist = wishlist.includes(projectId);
      setWishlist(prev =>
        isInWishlist ? prev.filter(id => id !== projectId) : [...prev, projectId]
      );

      const res = await apiClient.post(`/user/wishlist/${projectId}`);
      if (res.data?.status === 'success') {
        // Update local storage so other components (like header) stay in sync
        const userStr = localStorage.getItem('userUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.wishlist = res.data.data.wishlist;
          localStorage.setItem('userUser', JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
      // Revert optimistic update
      const userStr = localStorage.getItem('userUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        setWishlist(user.wishlist || []);
      }
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const params: any = {};
        if (emirateParam) {
          params.emirate = emirateParam;
        }
        if (categoryParam) {
          params.category = categoryParam;
        }
        
        const response = await projectService.getAll(params);
        const data = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
        if (Array.isArray(data)) seedProjects(data);
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [emirateParam, categoryParam]);

  const activeFilters = [
    categoryParam && { key: 'category', label: categoryParam },
    emirateParam && { key: 'emirate', label: emirateParam.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
  ].filter(Boolean) as { key: string; label: string }[];

  const removeFilterHref = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    const qs = next.toString();
    return qs ? `/projects?${qs}` : '/projects';
  };

  const formatSlug = (v: string) => v.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const emirateName = emirateParam ? formatSlug(emirateParam) : null;
  const pageTitle = categoryParam || (emirateName ? `Experiences in ${emirateName}` : 'Explore Activities');

  return (
    <div className="bg-white min-h-screen pt-6 sm:pt-8 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            <Link to="/projects" className="hover:text-gray-900 transition-colors">Experiences</Link>
            {categoryParam && (
              <>
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-gray-900 font-medium truncate">{categoryParam}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{pageTitle}</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                {isLoading
                  ? 'Finding experiences…'
                  : `${projects.length} ${projects.length === 1 ? 'experience' : 'experiences'} to explore`}
              </p>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map((f) => (
                  <Link
                    key={f.key}
                    to={removeFilterHref(f.key)}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
                    aria-label={`Remove ${f.label} filter`}
                  >
                    {f.label}
                    <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                ))}
                {activeFilters.length > 1 && (
                  <Link to="/projects" className="text-xs font-medium text-gray-500 hover:text-gray-900 underline-offset-2 hover:underline">
                    Clear all
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-y-5 sm:gap-x-5 sm:gap-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ExperienceCardSkeleton key={i} compact />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-lg border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
              <Compass className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No experiences found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeFilters.length ? 'Nothing matches this filter yet — try exploring everything instead.' : 'There are currently no experiences to display.'}
            </p>
            {activeFilters.length > 0 && (
              <Link to="/projects" className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                View all experiences
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-y-5 sm:gap-x-5 sm:gap-y-6">
            {projects.map((project) => (
              <ExperienceCard
                key={project.id}
                project={project}
                isSaved={wishlist.includes(project.id!)}
                onToggleWishlist={toggleWishlist}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
