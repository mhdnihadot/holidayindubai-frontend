import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { adminLogoutThunk } from '@/store/thunks/auth.thunks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await dispatch(adminLogoutThunk()).unwrap();
        navigate('/admin/login');
        toast.success('Logged out successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to log out');
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return {
    user,
    handleLogout,
    getInitials,
  };
};
