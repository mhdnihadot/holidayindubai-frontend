import React from 'react';
import { Link } from 'react-router-dom';
import { type Project } from '@/services/project.service';
import { Heart } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { useState, useEffect } from 'react';

interface GroupedExperiencesProps {
  projects: Project[];
}

const getCategoryIcon = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('top') || cat.includes('must-do')) {
    return (
      <svg className="w-6 h-6 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 4h2a2 2 0 012 2v3a4 4 0 01-4 4h-1m-7-9H6a2 2 0 00-2 2v3a4 4 0 004 4h1m4 0v5m0 0h-4m4 0h4m-4-15v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V4h8z" />
      </svg>
    );
  }
  if (cat.includes('landmark') || cat.includes('sightseeing')) {
    return (
      <svg className="w-6 h-6 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2v9m0 0l-3-3m3 3l3-3m-9 9h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
      </svg>
    );
  }
  if (cat.includes('desert') || cat.includes('nature')) {
    return (
      <svg className="w-6 h-6 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 21h18M5 21v-4a4 4 0 014-4h6a4 4 0 014 4v4M9 13v-3a3 3 0 013-3v0a3 3 0 013 3v3" />
      </svg>
    );
  }
  // Default icon
  return (
    <svg className="w-6 h-6 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
};

const GroupedExperiences: React.FC<GroupedExperiencesProps> = ({ projects }) => {
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

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.category || 'Top & Must-Do Experiences';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  // If there are no projects, don't render anything
  if (Object.keys(groupedProjects).length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pb-10">
      {Object.entries(groupedProjects).map(([category, items]) => (
        <div key={category} className="mb-10 sm:mb-12">
          {/* Section Header */}
          <div className="flex items-center mb-4 sm:mb-6">
            {getCategoryIcon(category)}
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold sm:font-bold text-gray-900">{category}</h2>
            <Link to={`/projects?category=${encodeURIComponent(category)}`} className="ml-2 sm:ml-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid of items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-5 sm:gap-6">
            {items.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="group flex flex-col focus:outline-none">
                <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden mb-2.5 bg-gray-100 shadow-xs group-hover:shadow-md transition-all">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleWishlist(e, project.id!)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none"
                  >
                    <Heart
                      strokeWidth={1.5}
                      className={`w-4 h-4 transition-colors ${wishlist.includes(project.id!) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                </div>

                <h3 className="text-base sm:text-[17px] font-semibold text-gray-900 mb-1 leading-tight group-hover:text-black transition-colors">
                  {project.title}
                </h3>
                <p
                  className="text-gray-500 text-xs sm:text-[12px] line-clamp-2 overflow-hidden mb-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description}
                </p>

                <div className="mt-auto flex items-center gap-4 text-xs sm:text-[13px] text-gray-500 font-normal">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate max-w-[140px]">{project.location || 'Dubai'}</span>
                  </div>
                  {project.duration && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{project.duration}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupedExperiences;
