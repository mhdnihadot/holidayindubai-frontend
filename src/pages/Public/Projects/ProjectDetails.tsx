import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, type Project } from '@/services/project.service';
import { adService, type Ad } from '@/services/ad.service';
import { enquiryService } from '@/services/enquiry.service';
import CustomSlider from '@/components/ui/CustomSlider';
import { toast } from 'sonner';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      try {
        const response = await projectService.getById(id);
        const data = response.data || response;
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project details', error);
      } finally {
        setIsLoading(false);
      }
    };

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

    fetchProject();
    fetchAds();
  }, [id]);

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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
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
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg text-xs font-medium ">
              {project.status}
            </span>
          )}
          {project.category && (
            <span className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1 rounded-lg text-xs font-medium ">
              {project.category}
            </span>
          )}
          {project.emirate && (
            <span className="bg-[#FF1645]/5 text-[#FF1645] border border-[#FF1645]/20 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 py-4 sm:py-8 pb-28 sm:pb-12">
        <div className="grid grid-cols-1 bg-white lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 pb-2">About this Project</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p className="whitespace-pre-wrap text-sm sm:text-base text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </section>

            {/* Key Information Grid */}
            <section className="bg-gray-50 rounded-lg p-5 sm:p-6 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-4 sm:pb-6">Key Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {project.location && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Location</span>
                    <span className="font-semibold text-gray-900">{project.location}</span>
                  </div>
                )}
                {project.emirate && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Emirate</span>
                    <span className="font-semibold text-gray-900">{project.emirate}</span>
                  </div>
                )}
                {project.duration && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Duration</span>
                    <span className="font-semibold text-gray-900">{project.duration}</span>
                  </div>
                )}
                {project.bestTime && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Best Time</span>
                    <span className="font-semibold text-gray-900">{project.bestTime}</span>
                  </div>
                )}
                {project.bestSeason && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Best Season</span>
                    <span className="font-semibold text-gray-900">{project.bestSeason}</span>
                  </div>
                )}
                {project.distanceFromCity && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Distance from City</span>
                    <span className="font-semibold text-gray-900">{project.distanceFromCity}</span>
                  </div>
                )}
                {project.whatsappNumber && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">WhatsApp</span>
                    <span className="font-semibold text-gray-900">{project.whatsappNumber}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 pb-3">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-50 p-2 rounded-lg">
                        {highlight.icon ? (
                          <img src={highlight.icon} alt="icon" className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-mono text-xl">✨</span>
                        )}
                      </div>
                      <span className="text-gray-700 text-sm font-medium pt-1">{highlight.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ideal For */}
            {project.idealFor && project.idealFor.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 pb-3">Ideal For</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {project.idealFor.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2.5 sm:gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-xs text-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-50 p-3 rounded-lg">
                        {item.icon ? (
                          <img src={item.icon} alt="icon" className="w-full h-full object-contain" />
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
                <h2 className="text-xl font-semibold text-gray-900 pb-3">Experience Itinerary</h2>
                <div className="space-y-4 sm:space-y-6">
                  {project.experienceSteps.map((step, index) => (
                    <div key={index} className="flex gap-3.5 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-xs">
                          {index + 1}
                        </div>
                        {index !== project.experienceSteps!.length - 1 && (
                          <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                        )}
                      </div>
                      <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs flex-1 mb-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{step.title}</h4>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Practical Information */}
            {(project.safetyAndComfort?.length || project.accessibility?.length || project.dressCode || project.nearbyLandmarks?.length) ? (
              <section className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Practical Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Safety & Comfort */}
                  {project.safetyAndComfort && project.safetyAndComfort.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">🛡️</span> Safety & Comfort
                      </h3>
                      <ul className="space-y-4">
                        {project.safetyAndComfort.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white rounded shadow-sm border border-gray-100 p-1">
                              {item.icon ? <img src={item.icon} alt="icon" className="w-full h-full object-contain" /> : '🛡️'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                              {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Accessibility */}
                  {project.accessibility && project.accessibility.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">♿</span> Accessibility
                      </h3>
                      <ul className="space-y-4">
                        {project.accessibility.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white rounded shadow-sm border border-gray-100 p-1">
                              {item.icon ? <img src={item.icon} alt="icon" className="w-full h-full object-contain" /> : '♿'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                              {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dress Code & Landmarks */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pt-8 border-t border-gray-200">
                    {project.dressCode && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">👕</span> Dress Code
                        </h3>
                        <div className="space-y-3">
                          {project.dressCode.recommended && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                              <span className="text-xs font-bold text-green-800 uppercase tracking-wider block mb-1">Recommended</span>
                              <p className="text-green-900 text-sm">{project.dressCode.recommended}</p>
                            </div>
                          )}
                          {project.dressCode.avoid && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                              <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-1">Avoid</span>
                              <p className="text-red-900 text-sm">{project.dressCode.avoid}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {project.nearbyLandmarks && project.nearbyLandmarks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">📍</span> Nearby Landmarks
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.nearbyLandmarks.map((landmark, index) => (
                            <span key={index} className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow-sm">
                              {landmark}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

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
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div id="property-contact-sidebar" className="bg-white rounded-xl shadow-xs border border-gray-200 p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-1">Interested in this property?</h3>
                <p className="text-gray-500 mb-5 text-xs sm:text-sm leading-relaxed">
                  Contact our expert agents today to schedule a viewing or request more information.
                </p>

                {enquirySuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center my-2 space-y-2">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-green-900 text-base">Enquiry Submitted!</h4>
                    <p className="text-xs text-green-700 leading-normal">
                      Thank you! Your enquiry has been received. Our tourism specialist will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setEnquirySuccess(false)}
                      className="text-xs font-semibold text-green-800 hover:text-green-900 underline pt-1"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone Number (WhatsApp / Call) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your contact number"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        What would you like to know? (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="E.g., group booking rates, itinerary details, date availability..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isSubmittingEnquiry ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Enquiry</span>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Featured Advertisements Carousel Section */}
              {ads.length > 0 && <CustomSlider images={ads} />}
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap shadow-md shadow-blue-600/20 active:scale-95 transition-all shrink-0"
        >
          Register Interest
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
