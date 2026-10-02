import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '@/components/Layout/PublicLayout';

// Core public journey stays in the main bundle so it renders immediately
import Landing from '@/pages/Public/Landing/Landing';
import ProjectList from '@/pages/Public/Projects/ProjectList';
import ProjectDetails from '@/pages/Public/Projects/ProjectDetails';

// Everything else is code-split and only downloaded when visited
const DashboardLayout = lazy(() => import('@/components/Layout/DashboardLayout'));
const AdminLogin = lazy(() => import('@/pages/Login/Login'));
const UserLogin = lazy(() => import('@/pages/Public/Login/UserLogin'));
const DashboardOverview = lazy(() => import('@/pages/Dashboard/DashboardOverview'));
const Projects = lazy(() => import('@/pages/Projects/Projects'));
const Ads = lazy(() => import('@/pages/Ads/Ads'));
const CategoryList = lazy(() => import('@/pages/Categories/CategoryList'));
const AddCategory = lazy(() => import('@/pages/Categories/AddCategory'));
const Users = lazy(() => import('@/pages/Users/Users'));
const Enquiries = lazy(() => import('@/pages/Enquiries/Enquiries'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const About = lazy(() => import('@/pages/Public/Static/About'));
const PrivacyPolicy = lazy(() => import('@/pages/Public/Static/PrivacyPolicy'));
const Terms = lazy(() => import('@/pages/Public/Static/Terms'));

const PageFallback = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900" />
  </div>
);

const withSuspense = (node: ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

export const router = createBrowserRouter([
  // Public Routes (User Facing)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/:id', element: <ProjectDetails /> },
      { path: 'about', element: withSuspense(<About />) },
      { path: 'privacy', element: withSuspense(<PrivacyPolicy />) },
      { path: 'terms', element: withSuspense(<Terms />) },
      { path: 'login', element: withSuspense(<UserLogin />) },
    ],
  },
  
  // Admin Authentication
  {
    path: '/admin/login',
    element: withSuspense(<AdminLogin />),
  },
  
  // Admin Dashboard
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: withSuspense(<DashboardLayout />),
        children: [
          { index: true, element: withSuspense(<DashboardOverview />) },
          { path: 'projects/*', element: withSuspense(<Projects />) },
          { path: 'ads/*', element: withSuspense(<Ads />) },
          { path: 'categories', element: withSuspense(<CategoryList />) },
          { path: 'categories/new', element: withSuspense(<AddCategory />) },
          { path: 'users', element: withSuspense(<Users />) },
          { path: 'enquiries', element: withSuspense(<Enquiries />) },
          { path: 'profile', element: withSuspense(<Profile />) },
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
