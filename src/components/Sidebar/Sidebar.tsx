import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { adminLogoutThunk } from '@/store/thunks/auth.thunks';
import {
  IconSidebarToggle,
  IconDashboard,
  IconChevronDown,
  IconMoreHorizontal,
  IconProjects,
  IconListing,
  IconAddSmall,
  IconUsers,
  IconEnquiries,
} from './Icons';

// --- Types & Configuration ---

export type SidebarItemConfig = {
  label: string;
  path?: string;
  icon?: React.FC<{ className?: string }>;
  children?: SidebarItemConfig[];
};

const MAIN_MENU: SidebarItemConfig[] = [
  { label: 'Dashboard', path: '/dashboard', icon: IconDashboard },
  { label: 'Users', path: '/dashboard/users', icon: IconUsers },
  { label: 'Enquiries', path: '/dashboard/enquiries', icon: IconEnquiries },
  {
    label: 'Projects',
    icon: IconProjects,
    children: [
      { label: 'Listing', path: '/dashboard/projects', icon: IconListing },
      { label: 'Add Project', path: '/dashboard/projects/add', icon: IconAddSmall },
    ],
  },
];

// --- Reusable Sidebar Item Component ---

const SidebarItem: React.FC<{
  item: SidebarItemConfig;
  depth?: number;
  openLabel?: string | null;
  onToggle?: (label: string) => void;
  isCollapsed?: boolean;
}> = ({ item, depth = 0, openLabel, onToggle, isCollapsed }) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const location = useLocation();

  const isOpen = openLabel !== undefined ? openLabel === item.label : localIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(isOpen ? '' : item.label);
    } else {
      setLocalIsOpen(!isOpen);
    }
  };

  // Check if current item or any of its children are active
  const isActive = React.useMemo(() => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child) => child.path && location.pathname.startsWith(child.path));
    }
    return false;
  }, [location.pathname, item]);

  // Open automatically if a child is active
  useEffect(() => {
    if (isActive && item.children) {
      if (onToggle) {
        onToggle(item.label);
      } else {
        setLocalIsOpen(true);
      }
    }
  }, [isActive, item.children]);

  const Icon = item.icon;
  const isNested = depth > 0;

  // Direct Link Item
  if (!item.children || item.children.length === 0) {
    if (isNested) {
      return (
        <li className="relative flex items-center gap-3 py-2 text-sm text-gray-600 dark:text-black hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
          <div className="absolute left-[-22px] top-1/2 w-4 border-t border-gray-200 dark:border-gray-700"></div>
          {item.path ? (
            <NavLink to={item.path} end className={({ isActive: linkActive }) => `flex items-center gap-3 w-full transition-colors ${linkActive ? 'text-gray-900 dark:text-white font-semibold' : ''}`}>
              {/* {Icon && <Icon className="w-5 h-5" />} */}
              {item.label}
            </NavLink>
          ) : (
            <div className="flex items-center gap-3 w-full">
              {/* {Icon && <Icon className="w-5 h-5" />} */}
              {item.label}
            </div>
          )}
        </li>
      );
    }

    return (
      <li className="relative group">
        <NavLink
          to={item.path || '#'}
          end
          className={({ isActive: linkActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${linkActive ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-black dark:border-white' : 'text-gray-600 dark:text-black hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${isCollapsed ? 'justify-center px-0' : ''}`
          }
          title={isCollapsed ? item.label : undefined}
        >
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      </li>
    );
  }

  // Dropdown Item
  return (
    <li className={`relative ${isCollapsed ? 'group' : ''}`}>
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-black dark:border-white' : 'text-gray-600 dark:text-black hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${isCollapsed ? 'justify-center px-0' : ''}`}
        onClick={isCollapsed ? undefined : handleToggle}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1 text-black">
            <IconMoreHorizontal className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
            <IconChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? '-rotate-180' : ''}`} />
          </div>
        )}
      </div>

      {/* Nested Children Tree */}
      {!isCollapsed ? (
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <ul className="pl-11 py-1 relative">
              <div className="absolute left-[22px] top-0 bottom-6 border-l border-gray-200 dark:border-gray-700"></div>
              {item.children.map((child, index) => (
                <SidebarItem key={index} item={child} depth={depth + 1} />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-[100]">
          <div className="w-48 bg-white dark:bg-[#1e293b] shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <ul className="py-2 flex flex-col gap-1 px-2">
              {item.children.map((child, index) => (
                <li key={index}>
                  <NavLink
                    to={child.path || '#'}
                    end
                    className={({ isActive: linkActive }) => `flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${linkActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-black hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {child.icon && <child.icon className="w-4 h-4" />}
                    {child.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

// --- Main Sidebar Component ---

const Sidebar: React.FC = () => {
  const [openMenuLabel, setOpenMenuLabel] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await dispatch(adminLogoutThunk()).unwrap();
        navigate('/');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <aside className={`flex-shrink-0 bg-[#fafafa] dark:bg-black border-r border-gray-200 dark:border-neutral-800 h-full flex flex-col overflow-visible font-sans transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
      {/* Header */}
      <div className={`py-4 flex items-center dark:border-neutral-800 transition-all ${isCollapsed ? 'flex-col gap-4 justify-center px-0' : 'px-4 justify-between'}`}>
        {/* {!isCollapsed && (
          <div className="animate-typing whitespace-nowrap">
            <span className="font-semibold text-base tracking-tight bg-black animate-shine bg-clip-text text-transparent block">PropertySeller.</span>
          </div>
        )} */}
        {/* {isCollapsed && <IconLogo />} */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-black hover:text-gray-700 transition-all ${isCollapsed ? '' : 'ml-auto'}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <IconSidebarToggle className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-0 flex flex-col gap-6 overflow-visible ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {/* Main Menu Configuration */}
        <div>
          {!isCollapsed && (
            <h3 className="text-black text-xs font-medium pb-3 capitalize transition-opacity duration-300 opacity-100">Main Menu</h3>
          )}
          <ul className="flex flex-col gap-1">
            {MAIN_MENU.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                openLabel={openMenuLabel}
                onToggle={setOpenMenuLabel}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer / Profile Card */}
      <div className={` ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className={`bg-white dark:bg-black  rounded-xl mb-3 border-gray-100 dark:border-neutral-800 gap-3 p-3 flex-col flex items-center justify-between transition-all ${isCollapsed ? 'px-2' : 'border'}`}>
          {!isCollapsed ? (
            <div className="w-full rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <div className="flex items-center gap-3">
                <img src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} alt="Profile" className="w-10 h-10 rounded-lg object-cover bg-blue-100 flex-shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-gray-900 dark:text-white font-semibold text-sm truncate">{user?.name || 'Admin'}</span>
                  <span className="text-black text-xs truncate">{user?.email || 'admin@example.com'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center py-2">
              <img src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} alt="Profile" className="w-10 h-10 rounded-lg object-cover bg-blue-100 flex-shrink-0 cursor-pointer" title={user?.name || 'Admin'} />
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sign Out"
            className={`w-full flex items-center justify-center gap-2 bg-white dark:bg-red-900/20 hover:bg-red-600 dark:hover:bg-red-900/40 text-red-600 text-sm font-medium py-2.5 rounded-lg hover:text-white transition-colors border border-red-500 dark:border-red-600 ${isCollapsed ? 'px-0 py-3' : ''}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
