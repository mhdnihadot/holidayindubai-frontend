import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import { IconMenu, IconBell } from '@/components/Sidebar/Icons';

const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center transition-colors">
      <div className="flex w-full max-w-[1550px] h-screen bg-white dark:bg-black overflow-hidden font-sans relative shadow-xl transition-colors">
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed on desktop, off-canvas on mobile */}
        <div className={`
        fixed inset-y-0 left-0 z-50 lg:static transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header - Visible mainly for mobile toggle or desktop top-actions */}
          <header className="bg-white dark:bg-black  dark:border-neutral-800 py-4 flex items-center px-4 lg:px-8 flex-shrink-0 transition-colors">
            <button
              className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mr-4 p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <IconMenu className="w-6 h-6" />
            </button>

            {/* Main Header Content */}
            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 lg:hidden">Dashboard</h1>
              {/* Desktop header space for search, profile, etc. */}
              <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6">

                {/* Theme Toggle */}
                {/* <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors p-1"
                  aria-label="Toggle Dark Mode"
                >
                  {resolvedTheme === 'dark' ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
                </button> */}

                {/* Notification Bell */}
                <button className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors p-1 relative">
                  <IconBell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
                </button>

                {/* Profile Avatar */}
                <Link to="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-white text-white dark:text-black flex items-center justify-center font-semibold text-sm">
                    JD
                  </div>
                </Link>
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:px-8 bg-white dark:bg-neutral-900 transition-colors">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
