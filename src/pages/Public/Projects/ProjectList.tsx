import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { projectService, type Project } from '@/services/project.service';
import { ArrowRight, ChevronRight, Clock, Compass, Heart, ImageOff, MapPin, X } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { prefetchProject, seedProjects } from '@/services/projectCache';

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
    emirateParam && { key: 'emirate', label: emirateParam },
  ].filter(Boolean) as { key: string; label: string }[];

  const removeFilterHref = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    const qs = next.toString();
    return qs ? `/projects?${qs}` : '/projects';
  };

  const pageTitle = categoryParam || (emirateParam ? `Experiences in ${emirateParam}` : 'Explore Activities');

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 w-1/3 bg-gray-200 rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="pt-3 mt-1 border-t border-gray-100 flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {projects.map((project) => {
              const saved = wishlist.includes(project.id!);
              return (
                <Link
                  to={`/projects/${project.id}`}
                  key={project.id}
                  onMouseEnter={() => prefetchProject(project.id)}
                  onTouchStart={() => prefetchProject(project.id)}
                  className="group flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageOff className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                    )}

                    {project.category && (
                      <span className="absolute top-3 left-3 max-w-[70%] truncate bg-white text-gray-900 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {project.category}
                      </span>
                    )}

                    <button
                      onClick={(e) => toggleWishlist(e, project.id!)}
                      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors z-10"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col p-4">
                    {(project.location || project.emirate) && (
                      <p className="flex items-center gap-1 text-xs text-gray-500 mb-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                        <span className="truncate">
                          {[project.location, project.emirate].filter(Boolean).join(', ')}
                        </span>
                      </p>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug line-clamp-1">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
                    )}

                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {project.duration ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {project.duration}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                          View details
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
