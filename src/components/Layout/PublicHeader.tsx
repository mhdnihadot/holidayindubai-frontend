import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bell, Plus, User, Apple } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import logo1 from '../../assets/logo-1.png';
import apiClient from '../../services/apiClient';

const PublicHeader: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  // Profile edit states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const wishlistDropdownRef = useRef<HTMLDivElement>(null);

  // Check login state
  const userToken = localStorage.getItem('userToken');
  const userDataStr = localStorage.getItem('userUser');
  const isLoggedIn = !!userToken;
  const user = isLoggedIn && userDataStr ? JSON.parse(userDataStr) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (wishlistDropdownRef.current && !wishlistDropdownRef.current.contains(event.target as Node)) {
        setIsWishlistOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch wishlist when dropdown opens
  useEffect(() => {
    if (isWishlistOpen && isLoggedIn) {
      const fetchWishlist = async () => {
        setIsLoadingWishlist(true);
        try {
          const res = await apiClient.get('/user/wishlist');
          if (res.data?.status === 'success') {
            setWishlistItems(res.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch wishlist', error);
        } finally {
          setIsLoadingWishlist(false);
        }
      };
      fetchWishlist();
    }
  }, [isWishlistOpen, isLoggedIn]);

  const handleRemoveFromWishlist = async (projectId: string) => {
    try {
      // Optimistic update
      setWishlistItems(prev => prev.filter(item => item._id !== projectId && item.id !== projectId));

      const res = await apiClient.post(`/user/wishlist/${projectId}`);
      if (res.data?.status === 'success') {
        // Update user state in localStorage to sync hearts across pages
        const userStr = localStorage.getItem('userUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.wishlist = res.data.data.wishlist;
          localStorage.setItem('userUser', JSON.stringify(user));
        }
        // Dispatch re-render to update UI across the app (like ProjectList hearts)
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  // Sync profile data to edit state when modal opens
  useEffect(() => {
    if (isProfileModalOpen && user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditAvatar(user.avatar || '');
    }
  }, [isProfileModalOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
        throw new Error('Cloudinary config missing.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setEditAvatar(data.secure_url);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await apiClient.put('/user/profile', {
        name: editName,
        phone: editPhone,
        avatar: editAvatar
      });

      if (res.data?.status === 'success') {
        // Update local storage
        localStorage.setItem('userUser', JSON.stringify(res.data.data));
        setIsProfileModalOpen(false);
        // Dispatch re-render or reload
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        const res = await apiClient.post('/user/google-auth', {
          email: userInfo.email,
          name: userInfo.name,
          googleId: userInfo.sub,
          avatar: userInfo.picture,
        });

        const data = res.data;
        if (data.status === 'success') {
          localStorage.setItem('userToken', data.data.token);
          localStorage.setItem('userUser', JSON.stringify(data.data.user));
          setIsAuthOpen(false);
          // Trigger a re-render by dispatching a custom event or reloading
          window.location.reload();
        } else {
          alert('Google login failed: ' + data.message);
        }
      } catch (err: any) {
        console.error("Error connecting to backend", err);
        alert('Google login failed: ' + (err.response?.data?.message || err.message));
      }
    },
    onError: error => console.log('Google Login Failed', error)
  });

  const handleAppleLogin = async () => {
    alert("Apple login will be implemented soon!");
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userUser');
    setIsProfileOpen(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white w-full">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <img src={logo1} alt="Holiday InDubai" className="h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 mt-1">
            <Link to="/projects" className="text-gray-700 hover:text-black font-medium text-xs transition-colors">
              Explore
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-black font-medium text-xs transition-colors">
              Contact
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-black font-medium text-xs transition-colors">
              Blog
            </Link>
            <Link to="/news" className="text-gray-700 hover:text-black font-medium text-xs transition-colors">
              News
            </Link>
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-full text-sm font-medium transition-colors">
            Top picks
          </button>
          <button className="hidden sm:flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-3 rounded-full text-xs font-medium transition-colors">
            <Plus strokeWidth={1.4} className="w-4 h-4" />
            For Business
          </button>

          {/* Icons container */}
          <div className="flex items-center gap-3 ml-2 relative" ref={dropdownRef}>
            <div className="relative" ref={wishlistDropdownRef}>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsAuthOpen(true);
                  } else {
                    setIsWishlistOpen(!isWishlistOpen);
                  }
                }}
                className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart strokeWidth={1.4} className="w-5 h-5" />
              </button>

              {isWishlistOpen && isLoggedIn && (
                <div className="absolute top-[120%] right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Your Wishlist</h4>
                  {isLoadingWishlist ? (
                    <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
                  ) : wishlistItems.length > 0 ? (
                    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                      {wishlistItems.map(item => (
                        <div key={item._id || item.id} className="flex gap-3 items-center group">
                          <Link to={`/projects/${item._id || item.id}`} onClick={() => setIsWishlistOpen(false)} className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                              {item.images && item.images.length > 0 ? (
                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-200"></div>
                              )}
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/projects/${item._id || item.id}`} onClick={() => setIsWishlistOpen(false)} className="block truncate text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {item.title}
                            </Link>
                            <p className="text-xs text-gray-500 truncate">{item.location}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(item._id || item.id); }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove from wishlist"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      <Heart className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      Your wishlist is empty
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
              <Bell strokeWidth={1.4} className="w-5 h-5" />
            </button>

            {/* Conditional User Icon / Avatar */}
            {isLoggedIn && user ? (
              <div className="relative ml-1" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 transition-transform hover:scale-105"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute top-[120%] right-0 w-56 bg-white rounded shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors font-medium"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors font-medium"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(!isAuthOpen)}
                className={`w-9 h-9 ml-1 rounded-full flex items-center justify-center transition-colors overflow-hidden ${isAuthOpen ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              >
                <User className="w-6 h-6" strokeWidth={1} />
              </button>
            )}

            {/* Auth Modal UI */}
            {isAuthOpen && !isLoggedIn && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 animate-in fade-in duration-500"
                  onClick={() => setIsAuthOpen(false)}
                ></div>

                <div className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl border border-gray-100 p-8 z-10 animate-in fade-in zoom-in-95 duration-500">
                  <button
                    onClick={() => setIsAuthOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h3>
                    <p className="text-sm text-gray-500 mt-2">Log in or sign up to continue</p>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <button
                      onClick={() => handleGoogleLogin()}
                      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </button>

                    <button
                      onClick={() => handleAppleLogin()}
                      className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white px-4 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
                    >
                      <Apple className="w-5 h-5" fill="currentColor" />
                      Continue with Apple
                    </button>
                  </div>

                  <div className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
                    By continuing, you agree to our <Link to="/terms" onClick={() => setIsAuthOpen(false)} className="underline hover:text-gray-900 font-medium">Terms of Service</Link> and <Link to="/privacy" onClick={() => setIsAuthOpen(false)} className="underline hover:text-gray-900 font-medium">Privacy Policy</Link>.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal UI */}
      {isProfileModalOpen && isLoggedIn && user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 animate-in fade-in duration-500"
            onClick={() => setIsProfileModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-gray-100 p-8 z-10 animate-in fade-in zoom-in-95 duration-500">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h3>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm relative">
                  {editAvatar ? (
                    <img src={editAvatar} alt={editName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-4xl">
                      {editName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving || isUploading}
              className="mt-8 w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white px-4 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
