import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import PublicLayout from '@/components/Layout/PublicLayout';
import AdminLogin from '@/pages/Login/Login';
import UserLogin from '@/pages/Public/Login/UserLogin';

import DashboardOverview from '@/pages/Dashboard/DashboardOverview';
import Projects from '@/pages/Projects/Projects';
import CategoryList from '@/pages/Categories/CategoryList';
import AddCategory from '@/pages/Categories/AddCategory';
import Users from '@/pages/Users/Users';
import Enquiries from '@/pages/Enquiries/Enquiries';
import Profile from '@/pages/Profile/Profile';

// Public Pages
import Landing from '@/pages/Public/Landing/Landing';
import ProjectList from '@/pages/Public/Projects/ProjectList';
import ProjectDetails from '@/pages/Public/Projects/ProjectDetails';
import About from '@/pages/Public/Static/About';
import PrivacyPolicy from '@/pages/Public/Static/PrivacyPolicy';
import Terms from '@/pages/Public/Static/Terms';

export const router = createBrowserRouter([
  // Public Routes (User Facing)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/:id', element: <ProjectDetails /> },
      { path: 'about', element: <About /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'login', element: <UserLogin /> },
    ],
  },
  
  // Admin Authentication
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  
  // Admin Dashboard
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: 'projects/*', element: <Projects /> },
          { path: 'categories', element: <CategoryList /> },
          { path: 'categories/new', element: <AddCategory /> },
          { path: 'users', element: <Users /> },
          { path: 'enquiries', element: <Enquiries /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
  
  // Fallback Route
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
