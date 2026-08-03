import { useState, useEffect, useCallback } from 'react';
import type { CustomSliderProps } from './types';

export const useCustomSlider = ({ images, intervalMs = 4500 }: CustomSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images, intervalMs]);

  const handleClick = useCallback((_id?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentImage = images && images.length > 0 ? images[currentIndex] : null;

  return {
    currentIndex,
    currentImage,
    handleClick,
  };
};
