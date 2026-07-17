import React from 'react';
import { useProfile } from './useProfile';

const Profile: React.FC = () => {
  const { user, handleLogout, getInitials } = useProfile();

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">My Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your account settings and preferences.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800/50 flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Log Out
        </button>
      </div>
      
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
          {getInitials(user?.name)}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{user?.name || 'Loading...'}</h3>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      <form className="max-w-xl flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input 
            type="text" 
            defaultValue={user?.name || ''} 
            readOnly
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#0f172a] dark:text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors opacity-70 cursor-not-allowed" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <input 
            type="email" 
            defaultValue={user?.email || ''} 
            readOnly
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#0f172a] dark:text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors opacity-70 cursor-not-allowed" 
          />
        </div>
        <div className="mt-4">
          <button type="button" disabled className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors opacity-50 cursor-not-allowed">
            Save Changes (Coming Soon)
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
