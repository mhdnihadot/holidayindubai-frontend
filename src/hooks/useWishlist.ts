import { useEffect, useState } from 'react';
import type React from 'react';
import apiClient from '@/services/apiClient';

// Shared wishlist state for experience cards (landing rows, details suggestions).
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load user's wishlist on mount and listen to storage events
  useEffect(() => {
    const loadWishlist = () => {
      const userStr = localStorage.getItem('userUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.wishlist) {
            setWishlist(user.wishlist.map((w: any) => typeof w === 'string' ? w : w._id || w.id));
          }
        } catch (e) {
          console.error('Error parsing user data for wishlist', e);
        }
      }
    };

    loadWishlist();
    window.addEventListener('storage', loadWishlist);

    return () => {
      window.removeEventListener('storage', loadWishlist);
    };
  }, []);

  const toggleWishlist = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault(); // Prevent navigating to project details
    e.stopPropagation();

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      alert("Please log in to save properties to your wishlist.");
      return;
    }

    try {
      // Optimistic UI update
      const isInWishlist = wishlist.includes(projectId);
      setWishlist(prev =>
        isInWishlist ? prev.filter(id => id !== projectId) : [...prev, projectId]
      );

      const res = await apiClient.post(`/user/wishlist/${projectId}`);
      if (res.data?.status === 'success') {
        // Update local storage so other components (like header) stay in sync
        const userStr = localStorage.getItem('userUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.wishlist = res.data.data.wishlist;
          localStorage.setItem('userUser', JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
      // Revert optimistic update
      const userStr = localStorage.getItem('userUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        setWishlist(user.wishlist || []);
      }
    }
  };

  return { wishlist, toggleWishlist };
};
