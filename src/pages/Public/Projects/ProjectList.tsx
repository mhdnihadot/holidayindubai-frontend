import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService, type Project } from '@/services/project.service';
import { Heart } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { ProjectCardSkeleton } from '@/components/ui/ProjectCardSkeleton';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

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
        const response = await projectService.getAll();
        const data = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-gray-900 pb-3">All Projects</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Discover our complete portfolio of luxury properties and exclusive developments across Dubai.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider shadow-xs">
                      {project.status}
                    </span>
                    {project.category && (
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider shadow-xs">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => toggleWishlist(e, project.id!)}
                    className="absolute top-4 right-4 p-[7px] rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${wishlist.includes(project.id!) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{project.description}</p>

                  <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm mb-4">
                    {project.location && (
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Location</span>
                        <span className="font-semibold text-gray-900 truncate">{project.location}</span>
                      </div>
                    )}
                    {project.emirate && (
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Emirate</span>
                        <span className="font-semibold text-gray-900 truncate">{project.emirate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">View Details &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Projects Found</h3>
                <p className="text-gray-500">There are currently no projects available to display.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
