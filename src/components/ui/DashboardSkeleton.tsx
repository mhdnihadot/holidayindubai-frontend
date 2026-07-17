import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-black overflow-hidden">
      {/* Sidebar Skeleton */}
      <aside className="w-[280px] flex-shrink-0 bg-white dark:bg-black border-r border-gray-200 dark:border-neutral-800 h-full flex flex-col p-6">
        <div className="h-8 w-32 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-8"></div>
        <div className="h-16 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl animate-pulse mb-8"></div>
        <div className="space-y-4 flex-1">
          <div className="h-10 w-full bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
        </div>
        <div className="h-32 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl animate-pulse mt-auto"></div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col min-h-0">
        <header className="h-20 flex items-center px-8 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
          <div className="h-6 w-48 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
        </header>
        <div className="p-8 space-y-6">
          <div className="flex gap-6">
            <div className="h-32 flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl animate-pulse"></div>
            <div className="h-32 flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl animate-pulse"></div>
            <div className="h-32 flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-96 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl animate-pulse"></div>
        </div>
      </main>
    </div>
  );
};
