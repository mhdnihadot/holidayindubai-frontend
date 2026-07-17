import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { adminLoginThunk } from '@/store/thunks/auth.thunks';
import { toast } from 'sonner';

export const useLogin = () => {
  const [email, setEmail] = useState('example@gmail.com');
  const [password, setPassword] = useState('Nihad@123#');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    try {
      await dispatch(adminLoginThunk({ email, password })).unwrap();
      toast.success('Successfully logged in as Admin!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error || 'Failed to login');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};
