import React from 'react';
import { Link } from 'react-router-dom';
import { type Project } from '@/services/project.service';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { seedProjects } from '@/services/projectCache';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import { getCategoryIconComponent } from '@/utils/categoryIcons';
import { useWishlist } from '@/hooks/useWishlist';

interface GroupedExperiencesProps {
  projects: Project[];
}

const getCategoryIcon = (category: string) => {
  const Icon = getCategoryIconComponent(category);
  return <Icon className="w-6 h-6 text-pink-500 mr-2 shrink-0" strokeWidth={1.5} />;
};

// Max cards shown per row before the "View all" tile takes over
const ROW_LIMIT = 8;

interface CategoryRowProps {
  category: string;
  /** Heading text — defaults to the category name */
  title?: string;
  /** Override card widths per breakpoint */
  itemWidthClass?: string;
  items: Project[];
  wishlist: string[];
  onToggleWishlist: (e: React.MouseEvent, projectId: string) => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ category, title, items, wishlist, onToggleWishlist, itemWidthClass }) => {
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

  // Mobile: 2 cards visible with the next one peeking in. Desktop: exactly 4 per view.
  const itemWidth = itemWidthClass ?? 'w-[calc((100%-1rem)/2.15)] sm:w-[calc((100%-1.5rem)/2.2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]';

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        {getCategoryIcon(category)}
        <h2 className="text-base sm:text-xl md:text-2xl font-semibold sm:font-bold text-gray-900">{title ?? category}</h2>
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

  const { wishlist, toggleWishlist } = useWishlist();

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
