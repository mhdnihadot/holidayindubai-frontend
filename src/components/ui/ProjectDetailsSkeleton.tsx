import React from 'react';

const Bar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded-md ${className}`} />
);

// Mirrors the ProjectDetails layout (gallery → title → content + 301.5px sidebar)
// so nothing jumps when the real page swaps in.
export const ProjectDetailsSkeleton: React.FC = () => (
  <div className="animate-pulse" aria-busy="true" aria-label="Loading experience details">
    {/* Mobile hero card */}
    <div className="sm:hidden px-4 pt-3 pb-2">
      <div className="relative w-full aspect-[4/5] max-h-[560px] bg-gray-200 rounded-[12px] overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5">
          <Bar className="h-3 w-24 bg-gray-300" />
          <Bar className="h-6 w-3/4 bg-gray-300" />
          <div className="flex gap-2 pt-1">
            <Bar className="h-7 w-20 bg-gray-300 rounded-lg" />
            <Bar className="h-7 w-24 bg-gray-300 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    {/* Tablet & desktop gallery grid */}
    <div className="hidden sm:block w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 mt-4 mb-5">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 sm:gap-2.5 h-[340px] md:h-[400px] lg:h-[440px] xl:h-[460px]">
        <div className="col-span-2 row-span-2 bg-gray-200 rounded-l-2xl sm:rounded-l-3xl" />
        <div className="bg-gray-200" />
        <div className="bg-gray-200 rounded-tr-2xl sm:rounded-tr-3xl" />
        <div className="bg-gray-200" />
        <div className="bg-gray-200 rounded-br-2xl sm:rounded-br-3xl" />
      </div>
    </div>

    {/* Title block */}
    <div className="hidden sm:block max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pt-2 pb-4">
      <div className="flex gap-2 mb-3">
        <Bar className="h-7 w-20 rounded-lg" />
        <Bar className="h-7 w-40 rounded-lg" />
        <Bar className="h-7 w-20 rounded-lg" />
      </div>
      <Bar className="h-9 w-2/3 mb-3" />
      <Bar className="h-5 w-1/2" />
    </div>

    {/* Content + sidebar */}
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pt-4 sm:pt-2 pb-28 sm:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_301.5px] gap-8 lg:gap-10">
        <div className="min-w-0 space-y-10">
          {/* About */}
          <div className="space-y-3">
            <Bar className="h-6 w-48" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-11/12" />
            <Bar className="h-4 w-3/5" />
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <Bar className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                  <Bar className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-5">
            <Bar className="h-6 w-52" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2 pt-1.5">
                  <Bar className="h-3 w-16" />
                  <Bar className="h-4 w-full" />
                  <Bar className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:max-w-[301.5px]">
          <div className="rounded-lg border border-gray-200 p-5 sm:p-6 space-y-4">
            <Bar className="h-6 w-4/5" />
            <Bar className="h-4 w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Bar className="h-3 w-24" />
                <Bar className="h-11 w-full rounded-lg" />
              </div>
            ))}
            <Bar className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectDetailsSkeleton;
