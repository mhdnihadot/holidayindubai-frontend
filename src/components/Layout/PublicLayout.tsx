import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Stop the browser from restoring the old scroll position on reload
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const PublicLayout: React.FC = () => {
  const { pathname, search } = useLocation();

  // Every page (and every reload) starts from the top
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      {/* Header */}
      <PublicHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-white">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
