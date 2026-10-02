import React from 'react';
import { Link } from 'react-router-dom';
import { type Project } from '@/services/project.service';
import apiClient from '@/services/apiClient';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { seedProjects } from '@/services/projectCache';
import { ExperienceCard } from '@/components/ui/ExperienceCard';

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

// Max cards shown per row before the "View all" tile takes over
const ROW_LIMIT = 8;

interface CategoryRowProps {
  category: string;
  items: Project[];
  wishlist: string[];
  onToggleWishlist: (e: React.MouseEvent, projectId: string) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, items, wishlist, onToggleWishlist }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const visible = items.slice(0, ROW_LIMIT);
  const hasMore = items.length > ROW_LIMIT;
  const categoryHref = `/projects?category=${encodeURIComponent(category)}`;

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows, items.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  // Mobile: ~72% wide so the next card peeks in. Desktop: exactly 4 per view.
  const itemWidth = 'w-[72%] sm:w-[calc((100%-1.5rem)/2.2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]';

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        {getCategoryIcon(category)}
        <h2 className="text-base sm:text-xl md:text-2xl font-semibold sm:font-bold text-gray-900">{category}</h2>
        <Link to={categoryHref} className="ml-2 sm:ml-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        {(canPrev || canNext) && (
          <div className="hidden md:flex ml-auto gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              aria-label="Scroll left"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 hover:border-gray-900 disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              aria-label="Scroll right"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 hover:border-gray-900 disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        onScroll={updateArrows}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {visible.map((project) => (
          <div key={project.id} className={`${itemWidth} flex-none snap-start`}>
            <ExperienceCard
              project={project}
              isSaved={wishlist.includes(project.id!)}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}

        {hasMore && (
          <div className={`${itemWidth} flex-none snap-start`}>
            <Link
              to={categoryHref}
              className="group flex flex-col items-center justify-center gap-3 aspect-[4/3] rounded-2xl sm:rounded-3xl border border-gray-200 bg-gray-50 hover:border-gray-900 transition-colors"
            >
              <span className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-900 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-colors">
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-semibold text-gray-900">View all {items.length}</span>
              <span className="text-xs text-gray-500 -mt-2">in {category}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const GroupedExperiences: React.FC<GroupedExperiencesProps> = ({ projects }) => {
  useEffect(() => {
    seedProjects(projects);
  }, [projects]);

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

  // Sort categories by the number of projects (descending)
  const sortedCategories = Object.entries(groupedProjects).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pb-10">
      {sortedCategories.map(([category, items]) => (
        <div key={category} className="mb-10 sm:mb-12">
          <CategoryRow
            category={category}
            items={items}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        </div>
      ))}
    </div>
  );
};

export default GroupedExperiences;
