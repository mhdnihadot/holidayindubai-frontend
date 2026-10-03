import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Project } from '@/services/project.service';
import { fetchProject as fetchProjectCached, getCachedProject } from '@/services/projectCache';
import { adService, type Ad } from '@/services/ad.service';
import CustomSlider from '@/components/ui/CustomSlider';
import { ProjectDetailsSkeleton } from '@/components/ui/ProjectDetailsSkeleton';
import { CategoryRow } from '@/components/ui/GroupedExperiences';
import { useWishlist } from '@/hooks/useWishlist';
import { useSeo } from '@/hooks/useSeo';
import { getMapEmbedUrl, getMapOpenUrl } from '@/utils/googleMap';
import { projectService } from '@/services/project.service';
import { seedProjects } from '@/services/projectCache';
import { Accessibility, CalendarDays, Check, Clock, Compass, Map as MapIcon, MapPin, MessageCircle, Navigation, Sun, Phone, Globe, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

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
  // Mobile gallery: which photos have finished loading (shimmer shows until then)
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // New project → fresh gallery state
  useEffect(() => {
    setLoadedSlides({});
    setActiveMobileSlide(0);
  }, [id]);

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

  const { wishlist, toggleWishlist } = useWishlist();

  // SEO: "<Experience> – <Emirate> | HolidayInDubai"
  useSeo({
    title: project ? [project.title, project.emirate].filter(Boolean).join(' – ') : undefined,
    description: project ? (project.subtitle ? `${project.subtitle}. ` : '') + (project.description || '') : undefined,
    path: id ? `/projects/${id}` : undefined,
    image: project?.images?.[0],
    type: 'article',
  });
  const [suggestions, setSuggestions] = useState<Project[]>([]);

  // "You may also like" — same category first, then same emirate. Fetched after the page is on screen.
  const suggestionKey = project ? `${(project as any)._id || project.id}|${project.category ?? ''}|${project.emirate ?? ''}` : '';
  useEffect(() => {
    if (!project) return;
    let cancelled = false;
    const currentId = (project as any)._id || project.id;
    const load = async () => {
      try {
        const pick = (res: any): Project[] => {
          const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          return list.filter((p: Project) => ((p as any)._id || p.id) !== currentId);
        };
        let list: Project[] = project.category ? pick(await projectService.getAll({ category: project.category })) : [];
        if (list.length < 2 && project.emirate) {
          const byEmirate = pick(await projectService.getAll({ emirate: project.emirate }));
          const seen = new Set(list.map((p) => p.id));
          list = [...list, ...byEmirate.filter((p) => !seen.has(p.id))];
        }
        if (!cancelled) {
          seedProjects(list);
          setSuggestions(list);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      }
    };
    const w = window as any;
    const handle = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 400);
    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle); else clearTimeout(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionKey]);

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

  // Contact: WhatsApp + Call both use the project's whatsappNumber. Buttons always show;
  // when a project has no number they simply do nothing.
  const contactDigits = project?.whatsappNumber?.replace(/\D/g, '') || '';
  const whatsappHref = contactDigits
    ? `https://wa.me/${contactDigits}?text=${encodeURIComponent(`Hi, I'm interested in ${project?.title ?? 'this experience'}`)}`
    : undefined;
  const callHref = contactDigits ? `tel:+${contactDigits}` : undefined;

  // Website = the project's platformUrl (link stored by the admin)
  const websiteHref = project?.platformUrl?.trim() || undefined;

  // Icon-only contact buttons: WhatsApp, Call, Visit website. Each one is inert when its data is missing.
  const ContactButtons = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
    const btn = (enabled: boolean) =>
      `inline-flex items-center justify-center rounded-lg bg-gray-900 text-white transition-colors ${
        size === 'sm' ? 'w-10 h-10' : 'flex-1 h-11'
      } ${enabled ? 'hover:bg-gray-800 active:bg-gray-700' : 'cursor-default'}`;
    const iconCls = size === 'sm' ? 'w-[18px] h-[18px]' : 'w-5 h-5';
    const guard = (enabled: boolean) => (e: React.MouseEvent) => { if (!enabled) e.preventDefault(); };
    return (
      <>
        <a href={whatsappHref} target={whatsappHref ? '_blank' : undefined} rel="noopener noreferrer" onClick={guard(!!whatsappHref)} className={btn(!!whatsappHref)} aria-label="Chat on WhatsApp" title="WhatsApp">
          <svg className={iconCls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        </a>
        <a href={callHref} onClick={guard(!!callHref)} className={btn(!!callHref)} aria-label="Call" title="Call">
          <Phone className={iconCls} strokeWidth={1.5} />
        </a>
        <a href={websiteHref} target={websiteHref ? '_blank' : undefined} rel="noopener noreferrer" onClick={guard(!!websiteHref)} className={btn(!!websiteHref)} aria-label="Visit website" title="Visit website">
          <Globe className={iconCls} strokeWidth={1.5} />
        </a>
      </>
    );
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
    <div className="bg-white pb-14">


      {/* Gallery Section - Specialized layouts for Mobile, Tablet, and Desktop */}
      <div className="w-full">
        {/* 1. Mobile View: simple photo card + plain title block (< 640px / sm:hidden) */}
        <div className="sm:hidden px-4 pt-3 pb-2">
          <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {images.length > 0 ? (
              <>
                <div
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
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
                    <div key={idx} className="min-w-full h-full snap-center relative overflow-hidden bg-gray-100">
                      {!loadedSlides[idx] && (
                        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        </div>
                      )}
                      <img
                        src={img}
                        alt={`${project.title} - photo ${idx + 1}`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        decoding="async"
                        onLoad={() => setLoadedSlides((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }))}
                        className={`relative w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${loadedSlides[idx] ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setIsGalleryModalOpen(true);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Save */}
                <button
                  onClick={(e) => toggleWishlist(e, (project as any)._id || project.id)}
                  className="absolute top-3 right-3 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center focus:outline-none"
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className={`w-[18px] h-[18px] ${wishlist.includes((project as any)._id || project.id) ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
                    strokeWidth={1.5}
                  />
                </button>

                {/* Dot indicators — max 8 visible; with more photos the window slides
                    with the active photo and edge dots shrink to hint there are more */}
                {images.length > 1 && (() => {
                  const MAX_DOTS = 8;
                  const total = images.length;
                  const count = Math.min(MAX_DOTS, total);
                  const start = total > MAX_DOTS
                    ? Math.min(Math.max(activeMobileSlide - Math.floor(MAX_DOTS / 2), 0), total - MAX_DOTS)
                    : 0;
                  return (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-none" aria-hidden="true">
                      {Array.from({ length: count }).map((_, i) => {
                        const idx = start + i;
                        const isActive = idx === activeMobileSlide;
                        const isEdge =
                          (i === 0 && start > 0) || (i === count - 1 && start + count < total);
                        return (
                          <span
                            key={idx}
                            className={`rounded-full transition-all duration-200 ${isActive ? 'w-2 h-2 bg-white' : isEdge ? 'w-1 h-1 bg-white/60' : 'w-1.5 h-1.5 bg-white/60'
                              }`}
                          />
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image available</div>
            )}
          </div>

          {/* Title block */}
          <div className="pt-4">
            {(project.location || project.emirate) && (
              <p className="text-xs text-gray-500 truncate">{project.location || project.emirate}</p>
            )}
            <h1 className="mt-1 text-xl font-semibold text-gray-900 leading-snug">{project.title}</h1>
            {project.subtitle && <p className="mt-1 text-sm text-gray-600">{project.subtitle}</p>}
            {(project.category || project.emirate || project.duration) && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {project.category && (
                  <span className="px-2.5 py-1 rounded-full bg-gray-900 text-white text-[11px] font-medium">
                    {project.category}
                  </span>
                )}
                {project.emirate && (
                  <span className="px-2.5 py-1 rounded-full bg-[#FF1645]/10 text-[#FF1645] text-[11px] font-semibold">
                    {project.emirate}
                  </span>
                )}
                {project.duration && (
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">
                    {project.duration}
                  </span>
                )}
              </div>
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

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 pt-4 sm:pt-2 pb-0 sm:pb-0">
        <div className="grid grid-cols-1 bg-white lg:grid-cols-[minmax(0,1fr)_301.5px] gap-5 sm:gap-8 lg:gap-10">

          {/* Main Content */}
          <div className="min-w-0 space-y-8">
            {/* Project Title & Header Info (tablet/desktop) — inside the left column so the sidebar starts level with it */}
            <div className="hidden sm:block">
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


            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 pb-2">About this Project</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p className="whitespace-pre-wrap text-sm sm:text-base text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </section>

            {/* Mobile: ad banner sits right after the description (sidebar copy is tablet/desktop only) */}
            {ads.length > 0 && (
              <div className="md:hidden -mt-4">
                <CustomSlider images={ads} />
              </div>
            )}

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
                  <h2 className="text-xl font-semibold text-gray-900 pb-3">Practical Information</h2>
                  <div className="space-y-6">
                    {groups.filter((g) => g.items.length).map(({ key, label, items }) => (
                      <div key={key}>
                        <div className="pb-2">
                          <h3 className="text-base font-semibold text-gray-900 leading-tight">{label}</h3>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                          {items.map((item, index) => (
                            <li key={index} className="pl-1">
                              <div className="min-w-0">
                                <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">{item.title}</p>
                                {item.description && <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {hasDressCode && (
                      <div>
                        <div className="pb-2">
                          <h3 className="text-base font-semibold text-gray-900 leading-tight">Dress Code</h3>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                          {dressRecommended && (
                            <li className="pl-1 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                              <span className="font-medium text-gray-900">Recommended:</span> {dressRecommended}
                            </li>
                          )}
                          {dressAvoid && (
                            <li className="pl-1 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                              <span className="font-medium text-gray-900">Avoid:</span> {dressAvoid}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {landmarks.length > 0 && (
                      <div>
                        <div className="pb-2">
                          <h3 className="text-base font-semibold text-gray-900 leading-tight">Nearby Landmarks</h3>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                          {landmarks.map((landmark, index) => (
                            <li key={index} className="pl-1 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                              {landmark}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              );
            })()}

            {/* Location map — built from googleMapUrl (only real Google Maps embed URLs are used) */}
            {(() => {
              const embedUrl = getMapEmbedUrl(project.googleMapUrl);
              if (!embedUrl) return null;
              const openUrl = getMapOpenUrl(embedUrl, [project.title, project.location, project.emirate].filter(Boolean).join(', '));
              return (
                <section>
                  <div className="flex items-end justify-between gap-3 pb-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900">Location</h2>
                      {(project.location || project.emirate) && (
                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                          {[project.location, project.emirate].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    {openUrl && (
                      <a
                        href={openUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:underline underline-offset-2"
                      >
                        Open in Maps
                        <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                  <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <iframe
                      src={embedUrl}
                      title={`Map of ${project.title}`}
                      className="absolute inset-0 w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
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
            <div className="sticky top-18 space-y-3">
              <div id="property-contact-sidebar" className="bg-white !mb-0 rounded-lg border border-gray-200 p-3.5 sm:p-5">
                <h3 className="text-base font-semibold text-gray-900">Interested in this experience?</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-4 leading-relaxed">
                  Explore more or get in touch with the provider.
                </p>
                <div className="flex items-center gap-2.5">
                  <ContactButtons />
                </div>
              </div>

              {/* Featured Advertisements Carousel Section */}
              {ads.length > 0 && (
                <div className="hidden md:block mt-3">
                  <CustomSlider images={ads} imageClassName="lg:object-contain!" />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* You may also like — horizontally scrolling cards, same as the home rows */}
        {suggestions.length > 0 && (
          <section className="mt-8 sm:mt-14">
            <CategoryRow
              category={project.category || ''}
              title="You may also like"
              items={suggestions}
              // Phone: exactly 2 full cards per view (no peek); tablet/desktop unchanged
              itemWidthClass="w-[calc((100%-1rem)/2)] sm:w-[calc((100%-1.5rem)/2.2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          </section>
        )}
      </div>

    </div>
  );
};

export default ProjectDetails;
