import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { useAppDispatch } from '@/store/hooks';
import { adminCheckSessionThunk, userCheckSessionThunk } from '@/store/thunks/auth.thunks';
import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

function AppInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(adminCheckSessionThunk());
    dispatch(userCheckSessionThunk());
  }, [dispatch]);

  return <>{children}</>;
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <Provider store={store}>
          <AppInit>
            <Toaster position="top-center" />
            <RouterProvider router={router} />
          </AppInit>
        </Provider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
