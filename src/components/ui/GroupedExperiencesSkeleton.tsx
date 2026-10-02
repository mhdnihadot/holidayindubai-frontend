import React from 'react';
import { ExperienceCardSkeleton } from '@/components/ui/ExperienceCard';

// Mirrors GroupedExperiences (category header + 4-column card grid) so the
// landing page doesn't shift when real data replaces it.
export const GroupedExperiencesSkeleton: React.FC<{ sections?: number; cards?: number }> = ({ sections = 2, cards = 4 }) => (
  <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pb-10 animate-pulse" aria-busy="true" aria-label="Loading experiences">
    {Array.from({ length: sections }).map((_, s) => (
      <div key={s} className="mb-10 sm:mb-12">
        {/* Section header: icon + title + arrow */}
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-6 h-6 rounded-md bg-gray-200 mr-2" />
          <div className={`h-5 sm:h-7 bg-gray-200 rounded ${s % 2 ? 'w-44 sm:w-56' : 'w-56 sm:w-72'}`} />
          <div className="ml-2 sm:ml-3 w-7 h-7 rounded-full bg-gray-100" />
          {/* Scroll arrows (tablet/desktop) */}
          <div className="hidden md:flex ml-auto gap-2">
            <div className="w-8 h-8 rounded-full border border-gray-200" />
            <div className="w-8 h-8 rounded-full border border-gray-200" />
          </div>
        </div>

        {/* Same widths as the real scrolling row — next card peeks in on mobile */}
        <div className="flex gap-4 sm:gap-6 overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="w-[calc((100%-1rem)/2.15)] sm:w-[calc((100%-1.5rem)/2.2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)] flex-none">
              <ExperienceCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default GroupedExperiencesSkeleton;
