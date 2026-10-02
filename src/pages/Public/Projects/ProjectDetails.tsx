import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Project } from '@/services/project.service';
import { fetchProject as fetchProjectCached, getCachedProject } from '@/services/projectCache';
import { adService, type Ad } from '@/services/ad.service';
import { enquiryService } from '@/services/enquiry.service';
import CustomSlider from '@/components/ui/CustomSlider';
import { ProjectDetailsSkeleton } from '@/components/ui/ProjectDetailsSkeleton';
import { toast } from 'sonner';
import { Accessibility, CalendarDays, Check, Clock, Compass, Lock, Map as MapIcon, MapPin, MessageCircle, Navigation, Sun, MessageSquare, Phone, Send, User, ShieldCheck, Shirt, X } from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Render straight from cache (seeded by list pages) — no loader when we already have data
  const [project, setProject] = useState<Project | null>(() => getCachedProject(id));
  const [isLoading, setIsLoading] = useState(() => !getCachedProject(id));
  const [ads, setAds] = useState<Ad[]>([]);

  // Gallery & Gesture Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Enquiry Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Please provide both your name and phone number.');
      return;
    }
    if (!(project as any)?._id && !project?.id && !id) {
      toast.error('Invalid project reference.');
      return;
    }

    try {
      setIsSubmittingEnquiry(true);
      await enquiryService.createEnquiry({
        projectId: (project as any)?._id || project?.id || id!,
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      toast.success('Thank you! Your enquiry has been received.');
      setEnquirySuccess(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch (error: any) {
      console.error('Submission Error:', error);
      const errMsg = error?.response?.data?.message || error?.message || 'Failed to submit enquiry. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const cached = getCachedProject(id);
      if (cached) {
        setProject(cached);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      try {
        // Refresh in the background so list-seeded rows get the full detail fields
        const data = await fetchProjectCached(id);
        if (data) setProject(data);
        else if (!cached) setProject(null);
      } catch (error) {
        console.error('Failed to fetch project details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Sidebar ads are secondary — fetch them once the page content is on screen
  const hasProject = !!project;
  useEffect(() => {
    if (!hasProject || ads.length) return;
    const fetchAds = async () => {
      try {
        const response = await adService.getAll();
        const data = response.data || response;
        if (Array.isArray(data)) {
          const activeAds = data.filter((a: Ad) => a.status === 'active' && (a.websiteImage || a.mobileImage));
          setAds(activeAds);
        }
      } catch (error) {
        console.error('Failed to fetch advertisements', error);
      }
    };

    const w = window as any;
    const handle = w.requestIdleCallback ? w.requestIdleCallback(fetchAds, { timeout: 2000 }) : setTimeout(fetchAds, 300);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(handle) : clearTimeout(handle));
  }, [hasProject, ads.length]);

  // Keyboard navigation for Lightbox Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryModalOpen || !project?.images) return;
      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
      } else if (e.key === 'Escape') {
        setIsGalleryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryModalOpen, project]);

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !project?.images) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
    }
  };

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p className="text-gray-500 mb-6">The project you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Back to Projects
        </button>
      </div>
    );
  }

  const images = project.images && Array.isArray(project.images) && project.images.length > 0 ? project.images : [];

  return (
    <div className="bg-white pb-20">


      {/* Gallery Section - Specialized layouts for Mobile, Tablet, and Desktop */}
      <div className="w-full">
        {/* 1. Mobile View: Premium Overlay Card (< 640px / sm:hidden) */}
        <div className="sm:hidden px-4 pt-3 pb-2">
          <div className="relative w-full aspect-[4/5] max-h-[560px] bg-gray-900 rounded-[12px] overflow-hidden shadow-xl border border-gray-100">
            {images.length > 0 ? (
              <>
                <div
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden "
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const slideWidth = el.offsetWidth;
                    if (slideWidth > 0) {
                      const newIndex = Math.round(el.scrollLeft / slideWidth);
                      if (newIndex !== activeMobileSlide) {
                        setActiveMobileSlide(newIndex);
                      }
                    }
                  }}
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="min-w-full h-full snap-center relative">
                      <img
                        src={img}
                        alt={`${project.title} - photo ${idx + 1}`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        decoding="async"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setIsGalleryModalOpen(true);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Top Left Photo Count Badge */}
                <button
                  onClick={() => {
                    setCurrentImageIndex(activeMobileSlide);
                    setIsGalleryModalOpen(true);
                  }}
                  className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/15 shadow-md flex items-center gap-1.5 focus:outline-none"
                >
                  <svg className="w-3.5 h-3.5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{activeMobileSlide + 1} / {images.length}</span>
                </button>

                {/* Top Right Floating White Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Interactive visual toggle for wishlist
                  }}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-800 hover:text-red-500 transition-transform active:scale-90 focus:outline-none"
                  aria-label="Save project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Bottom Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none z-10" />

                {/* Bottom Content Area Inside Photo Card */}
                <div className="absolute bottom-0 left-0 w-full p-5 z-20 flex flex-col justify-end text-white">
                  {/* Location Row */}
                  <div className="flex items-center gap-1.5 text-gray-200 text-xs sm:text-sm font-medium mb-1.5 drop-shadow-xs">
                    <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{project.location || project.emirate || 'Dubai, United Arab Emirates'}</span>
                  </div>

                  {/* Title & Price/Status Row */}
                  <div className="flex items-baseline justify-between gap-3 mb-3.5">
                    <h1 className="text-2xl font-semibold text-white leading-tight drop-shadow-md line-clamp-2 flex-1">
                      {project.title}
                    </h1>
                    {project.status && (
                      <span className="text-white font-semibold text-lg whitespace-nowrap shrink-0 drop-shadow-md  capitalize">
                        {project.status}
                      </span>
                    )}
                  </div>

                  {/* Specs & Badges Pill Row */}
                  <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-0.5">
                    {project.category && (
                      <span className="bg-black/65 backdrop-blur-md border border-white/20 text-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-[#E2F736]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {project.category}
                      </span>
                    )}
                    {project.emirate && (
                      <span className="bg-black/65 backdrop-blur-md border border-white/20 text-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                        📍 {project.emirate}
                      </span>
                    )}
                    {project.duration && (
                      <span className="bg-black/65 backdrop-blur-md border border-white/20 text-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                        ⏱️ {project.duration}
                      </span>
                    )}
                    {project.bestTime && (
                      <span className="bg-black/65 backdrop-blur-md border border-white/20 text-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                        ✨ {project.bestTime}
                      </span>
                    )}
                    {!project.duration && !project.bestTime && (
                      <span className="bg-black/65 backdrop-blur-md border border-white/20 text-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                        ⭐ 4.9 Rated
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
          </div>
        </div>

        {/* 2. Tablet & Desktop View: 5-Photo Airbnb-Style Grid (>= 640px / sm:block) */}
        <div className="hidden sm:block w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 mt-4 mb-5 relative">
          {images.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 sm:gap-2.5 h-[340px] md:h-[400px] lg:h-[440px] xl:h-[460px] w-full min-h-0 min-w-0 overflow-hidden">
              {/* Left Column: Main Hero Image (Spans 2 columns & 2 rows) */}
              <div
                className="relative min-h-0 min-w-0 w-full h-full col-span-2 row-span-2 rounded-l-2xl sm:rounded-l-3xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setCurrentImageIndex(0);
                  setIsGalleryModalOpen(true);
                }}
              >
                <img
                  src={images[0]}
                  alt={project.title}
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              </div>

              {/* Right Side: Always exactly 4 slots in a 2x2 grid, displaying 'No Image' if fewer photos exist */}
              {[
                { img: images[1], idx: 1, corner: '' },
                { img: images[2], idx: 2, corner: 'rounded-tr-2xl sm:rounded-tr-3xl' },
                { img: images[3], idx: 3, corner: '' },
                { img: images[4], idx: 4, corner: 'rounded-br-2xl sm:rounded-br-3xl' },
              ].map((thumb, idx) => (
                <div
                  key={idx}
                  className={`relative min-h-0 min-w-0 w-full h-full col-span-1 row-span-1 ${thumb.corner} overflow-hidden ${thumb.img ? 'cursor-pointer group bg-gray-100' : 'bg-gray-100/80 border border-gray-200/60 flex flex-col items-center justify-center'
                    }`}
                  onClick={() => {
                    if (thumb.img) {
                      setCurrentImageIndex(thumb.idx);
                      setIsGalleryModalOpen(true);
                    }
                  }}
                >
                  {thumb.img ? (
                    <>
                      <img
                        src={thumb.img}
                        alt={`${project.title} - photo ${idx + 2}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center select-none">
                      <svg className="w-5 h-5 mb-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[11px] sm:text-xs font-medium">No Image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-3xl border border-gray-200">No Image Available</div>
          )}

          {/* Show All Photos Button (Airbnb luxury style with dot grid icon) */}
          {images.length > 0 && (
            <button
              onClick={() => {
                setCurrentImageIndex(0);
                setIsGalleryModalOpen(true);
              }}
              className="absolute bottom-5 right-7 xl:right-5 bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-xs border border-gray-900/15 font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all active:scale-95 hover:scale-102 z-10 focus:outline-none"
            >
              <svg className="w-4 h-4 text-gray-800 shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2h3v3H2V2zm5 0h3v3H7V2zm5 0h3v3h-3V2zM2 7h3v3H2V7zm5 0h3v3H7V7zm5 0h3v3h-3V7zM2 12h3v3H2v-3zm5 0h3v3H7v-3zm5 0h3v3h-3v-3z" />
              </svg>
              <span>Show all photos</span>
            </button>
          )}
        </div>
      </div>


      {/* Project Title & Header Info (Only visible on Tablet & Desktop since mobile has overlay in hero card) */}
      <div className="hidden sm:block max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pt-2 pb-4 sm:pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {project.status && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-medium capitalize">
              <span className="relative flex w-2 h-2">
                {project.status.toLowerCase() === 'active' && (
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                )}
                <span className={`relative inline-flex w-2 h-2 rounded-full ${project.status.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              </span>
              {project.status}
            </span>
          )}
          {project.category && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-medium">
              <Compass className="w-3.5 h-3.5 text-gray-900" strokeWidth={1.5} />
              {project.category}
            </span>
          )}
          {project.emirate && (
            <span className="inline-flex items-center gap-1.5 bg-[#FF1645]/10 text-[#FF1645] px-2.5 py-1 rounded-lg text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              {project.emirate}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="text-base sm:text-lg md:text-[18px] mt-0.5 text-gray-600 font-normal">
            {project.subtitle}
          </p>
        )}
      </div>

      {/* Full-Screen Swipe & Gesture Lightbox Modal */}
      {isGalleryModalOpen && images.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between select-none animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 sm:p-6 text-white border-b border-white/10 z-10">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-sm font-semibold text-gray-400">
                {currentImageIndex + 1} of {images.length}
              </span>
              <span className="text-sm md:text-base font-medium text-white truncate max-w-[200px] sm:max-w-md">
                {project.title}
              </span>
            </div>
            <button
              onClick={() => setIsGalleryModalOpen(false)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
              aria-label="Close Gallery"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Center Main Image (With Touch & Swipe Gesture Support) */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-8 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${project.title} fullscreen ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg sm:rounded-xl select-none shadow-2xl transition-transform duration-200"
              draggable={false}
            />

            {/* Previous Arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center shadow-xl transition-all hover:scale-105 focus:outline-none"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center shadow-xl transition-all hover:scale-105 focus:outline-none"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {images.length > 1 && (
            <div className="p-4 bg-black/80 border-t border-white/10 overflow-x-auto [&::-webkit-scrollbar]:hidden flex items-center justify-center gap-2 sm:gap-3 z-10">
              <div className="flex items-center gap-2 sm:gap-3 px-4 min-w-max">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none shrink-0 ${currentImageIndex === idx ? 'ring-2 ring-white scale-105 opacity-100 shadow-md' : 'opacity-40 hover:opacity-80'}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pt-4 sm:pt-2 pb-28 sm:pb-12">
        <div className="grid grid-cols-1 bg-white lg:grid-cols-[minmax(0,1fr)_301.5px] gap-8 lg:gap-10">

          {/* Main Content */}
          <div className="min-w-0 space-y-8">

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 pb-2">About this Project</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p className="whitespace-pre-wrap text-sm sm:text-base text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </section>

            {/* Key Information Grid */}
            {(() => {
              const whatsappDigits = project.whatsappNumber?.replace(/\D/g, '');
              const facts = [
                { label: 'Location', value: project.location, Icon: MapPin },
                { label: 'Emirate', value: project.emirate, Icon: MapIcon },
                { label: 'Duration', value: project.duration, Icon: Clock },
                { label: 'Best time', value: project.bestTime, Icon: Sun },
                { label: 'Best season', value: project.bestSeason, Icon: CalendarDays },
                { label: 'Distance from city', value: project.distanceFromCity, Icon: Navigation },
                { label: 'WhatsApp', value: project.whatsappNumber, Icon: MessageCircle, href: whatsappDigits ? `https://wa.me/${whatsappDigits}` : undefined },
              ].filter((f) => f.value?.toString().trim());
              if (!facts.length) return null;

              return (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 pb-4">Key Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {facts.map(({ label, value, Icon, href }) => (
                      <div key={label} className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 bg-white">
                        <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                          <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">{label}</p>
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="block mt-0.5 text-sm font-semibold text-gray-900 hover:text-gray-900 transition-colors">
                              {value}
                            </a>
                          ) : (
                            <p className="mt-0.5 text-sm font-semibold text-gray-900 leading-snug">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Highlights */}
            {project.highlights && project.highlights.some((h) => h.text?.trim()) && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 pb-4">Highlights</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                  {project.highlights.filter((h) => h.text?.trim()).map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 mt-px shrink-0 flex items-center justify-center rounded-full bg-gray-100 text-gray-900">
                        {highlight.icon ? (
                          <img src={highlight.icon} alt="" loading="lazy" className="w-3.5 h-3.5 object-contain" />
                        ) : (
                          <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                        )}
                      </span>
                      <span className="block text-sm sm:text-[15px] text-gray-700 leading-relaxed first-letter:uppercase">
                        {highlight.text.trim()}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Ideal For */}
            {project.idealFor && project.idealFor.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 pb-3">Ideal For</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {project.idealFor.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2.5 sm:gap-3 bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-50 p-3 rounded-lg">
                        {item.icon ? (
                          <img src={item.icon} alt="icon" loading="lazy" className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-mono text-2xl">🎯</span>
                        )}
                      </div>
                      <span className="text-gray-900 text-xs font-semibold leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Steps */}
            {project.experienceSteps && project.experienceSteps.length > 0 && (
              <section>
                <div className="flex items-end justify-between gap-3 pb-5">
                  <h2 className="text-xl font-semibold text-gray-900">Experience Itinerary</h2>
                  <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full">
                    {project.experienceSteps.length} {project.experienceSteps.length === 1 ? 'step' : 'steps'}
                  </span>
                </div>
                <ol>
                  {project.experienceSteps.map((step, index) => {
                    const isLast = index === project.experienceSteps!.length - 1;
                    // Titles like "Step 1" just repeat the number — only show real titles
                    const hasTitle = !!step.title?.trim() && !/^step\s*\d+$/i.test(step.title.trim());
                    return (
                      <li key={index} className={`group relative flex gap-4 sm:gap-5 ${isLast ? '' : 'pb-7 sm:pb-8'}`}>
                        {!isLast && (
                          <span aria-hidden className="absolute left-[17px] top-10 bottom-1 w-px bg-gray-200" />
                        )}
                        <div
                          className={`relative z-10 w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${index === 0
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-900 border border-gray-300 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900'
                            }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-900">
                            Step {String(index + 1).padStart(2, '0')}
                          </p>
                          {hasTitle && (
                            <h4 className="mt-1 text-base sm:text-lg font-semibold text-gray-900">{step.title}</h4>
                          )}
                          <p className="mt-1.5 text-sm sm:text-[15px] text-gray-600 leading-relaxed">{step.content}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {/* Practical Information */}
            {(() => {
              const safety = project.safetyAndComfort?.filter((i) => i.title?.trim()) ?? [];
              const access = project.accessibility?.filter((i) => i.title?.trim()) ?? [];
              const dressRecommended = project.dressCode?.recommended?.trim();
              const dressAvoid = project.dressCode?.avoid?.trim();
              const hasDressCode = !!(dressRecommended || dressAvoid);
              const landmarks = project.nearbyLandmarks?.filter((l) => l?.trim()) ?? [];
              if (!safety.length && !access.length && !hasDressCode && !landmarks.length) return null;

              const groups: { key: string; label: string; Icon: typeof ShieldCheck; items: typeof safety }[] = [
                { key: 'safety', label: 'Safety & Comfort', Icon: ShieldCheck, items: safety },
                { key: 'access', label: 'Accessibility', Icon: Accessibility, items: access },
              ];

              return (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 pb-5">Practical Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.filter((g) => g.items.length).map(({ key, label, Icon, items }) => (
                      <div key={key} className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                            <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900">{label}</h3>
                        </div>
                        <ul className="space-y-3.5">
                          {items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              {item.icon ? (
                                <img src={item.icon} alt="" loading="lazy" className="w-5 h-5 mt-0.5 shrink-0 object-contain" />
                              ) : (
                                <Check className="w-4 h-4 mt-0.5 shrink-0 text-gray-900" strokeWidth={1.5} />
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                {item.description && <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {hasDressCode && (
                      <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                            <Shirt className="w-[18px] h-[18px]" strokeWidth={1.5} />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900">Dress Code</h3>
                        </div>
                        <div className="space-y-3">
                          {dressRecommended && (
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center rounded-full bg-gray-900 text-white">
                                <Check className="w-3 h-3" strokeWidth={1.5} />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Recommended</p>
                                <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{dressRecommended}</p>
                              </div>
                            </div>
                          )}
                          {dressAvoid && (
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center rounded-full border border-gray-300 text-gray-500">
                                <X className="w-3 h-3" strokeWidth={1.5} />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Avoid</p>
                                <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{dressAvoid}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {landmarks.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                            <MapPin className="w-[18px] h-[18px]" strokeWidth={1.5} />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900">Nearby Landmarks</h3>
                        </div>
                        <ul className="divide-y divide-gray-100">
                          {landmarks.map((landmark, index) => (
                            <li key={index} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" />
                              <span className="text-sm text-gray-700">{landmark}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              );
            })()}

            {/* Gallery */}
            {/* {project.images && project.images.length > 1 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {project.images.slice(1).map((img, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200/60">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        onClick={() => {
                          setCurrentImageIndex(index + 1);
                          setIsGalleryModalOpen(true);
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )} */}

          </div>

          {/* Sidebar */}
          <div className="w-full lg:max-w-[301.5px] space-y-6">
            <div className="sticky top-18 space-y-6">
              <div id="property-contact-sidebar" className="bg-white rounded-lg border  border-gray-200 p-4 sm:p-4">
                <h3 className="text-base font-semibold text-gray-900">Interested in this experience?</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-4 leading-relaxed">
                  Share your details and our team will get back to you.
                </p>

                {enquirySuccess ? (
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-center space-y-1.5">
                    <div className="w-9 h-9 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Enquiry sent</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Thank you! Our tourism specialist will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setEnquirySuccess(false)}
                      className="text-xs font-medium text-gray-900 hover:underline pt-1"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-3">
                    <div>
                      <label htmlFor="enquiry-name" className="block text-xs font-medium text-gray-700 mb-1">
                        Full name <span className="text-gray-900">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                        <input
                          id="enquiry-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full h-10 pl-9 pr-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="enquiry-phone" className="block text-xs font-medium text-gray-700 mb-1">
                        Phone <span className="text-gray-400 font-normal">(WhatsApp / Call)</span> <span className="text-gray-900">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                        <input
                          id="enquiry-phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 50 000 0000"
                          className="w-full h-10 pl-9 pr-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="enquiry-message" className="block text-xs font-medium text-gray-700 mb-1">
                        Message <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                        <textarea
                          id="enquiry-message"
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Dates, group size, questions…"
                          className="w-full pl-9 pr-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-colors py-2 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="w-full h-11 bg-gray-900 hover:bg-gray-800 disabled:opacity-70 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmittingEnquiry ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" strokeWidth={1.5} />
                          <span>Send Enquiry</span>
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                      <Lock className="w-3 h-3" strokeWidth={1.5} />
                      We only use your number to reply to this enquiry
                    </p>
                  </form>
                )}
              </div>

              {/* Featured Advertisements Carousel Section */}
              {ads.length > 0 && <CustomSlider images={ads} imageClassName="lg:object-contain!" />}
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile View (< 640px / sm:hidden) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col truncate pr-2">
          <span className="text-xs text-gray-500 font-medium truncate flex items-center gap-1">
            <span>📍</span> {project.location || project.emirate || 'Dubai, U.A.E'}
          </span>
          <span className="text-sm font-bold text-gray-900 truncate">{project.title}</span>
        </div>
        <button
          onClick={() => {
            const sidebar = document.getElementById('property-contact-sidebar');
            if (sidebar) {
              sidebar.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap active:scale-95 transition-all shrink-0"
        >
          Register Interest
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
