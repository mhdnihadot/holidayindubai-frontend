import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  // Update slider position whenever page or totalPages changes
  useEffect(() => {
    if (containerRef.current) {
      const activeButton = containerRef.current.querySelector('[data-active="true"]') as HTMLButtonElement;
      if (activeButton) {
        setSliderStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      } else {
        setSliderStyle({ left: 0, width: 0 });
      }
    }
  }, [currentPage, totalPages]);

  // Compute standard sliding window with ellipsis ranges
  const getPageRange = () => {
    const range: (number | string)[] = [];

    // Always show page 1
    range.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = Math.min(totalPages - 1, 4);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
    }

    if (start > 2) {
      range.push('...');
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  if (totalRecords <= 0) return null;

  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-6 py-4 border-gray-100 dark:border-gray-800/60 bg-[#fafafa]/50 dark:bg-[#0f172a]/20 ${className}`}>
      <div ref={containerRef} className="relative flex items-center gap-1.5 p-1">
        {/* Sliding Magic Indicator */}
        {sliderStyle.width > 0 && (
          <div
            className="absolute top-1 bottom-1 rounded-lg bg-[#0066FF] shadow-sm transition-all duration-300 ease-out pointer-events-none z-0"
            style={{
              left: `${sliderStyle.left}px`,
              width: `${sliderStyle.width}px`,
            }}
          />
        )}

        {/* First Page Button (<<) */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none z-10"
          title="First Page"
        >
          <ChevronsLeft size={16} strokeWidth={1.8} />
        </button>

        {/* Previous Page Button (<) */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none z-10"
          title="Previous Page"
        >
          <ChevronLeft size={16} strokeWidth={1.8} />
        </button>

        {/* Clickable Page Numbers & Ellipsis */}
        {getPageRange().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-medium select-none z-10"
              >
                ...
              </span>
            );
          }

          const isCurrent = currentPage === page;
          return (
            <button
              key={`page-${page}`}
              data-active={isCurrent ? "true" : "false"}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-normal transition-all duration-300 z-10 border ${isCurrent
                ? 'border-transparent text-white'
                : 'border-gray-200/60 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Page Button (>) */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-9 h-9 rounded-lg border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none z-10"
          title="Next Page"
        >
          <ChevronRight size={16} strokeWidth={1.8} />
        </button>

        {/* Last Page Button (>>) */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-9 h-9 rounded-lg border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none z-10"
          title="Last Page"
        >
          <ChevronsRight size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Centered Entries Count Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-800 dark:text-gray-200">{((currentPage - 1) * limit) + 1}</span> to{' '}
        <span className="font-medium text-gray-800 dark:text-gray-200">{Math.min(currentPage * limit, totalRecords)}</span> of{' '}
        <span className="font-medium text-gray-800 dark:text-gray-200">{totalRecords}</span> entries
      </div>
    </div>
  );
};
