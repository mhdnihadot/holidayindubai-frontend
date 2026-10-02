import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { type Project } from '@/services/project.service';
import { prefetchProject } from '@/services/projectCache';

interface ExperienceCardProps {
  project: Project;
  isSaved: boolean;
  onToggleWishlist: (e: React.MouseEvent, projectId: string) => void;
  /** Shorter image on mobile (used by the /projects list) */
  compact?: boolean;
}

// Shared experience card — used on the landing page and the /projects list so both stay identical.
export const ExperienceCard: React.FC<ExperienceCardProps> = ({ project, isSaved, onToggleWishlist, compact = false }) => (
  <Link to={`/projects/${project.id}`} onMouseEnter={() => prefetchProject(project.id)} onTouchStart={() => prefetchProject(project.id)} className="group flex flex-col focus:outline-none">
    <div className={`relative ${compact ? 'aspect-[16/10] sm:aspect-[4/3]' : 'aspect-[4/3]'} rounded-2xl sm:rounded-3xl overflow-hidden mb-2.5 bg-gray-100 shadow-xs group-hover:shadow-md transition-all`}>
      {project.images && project.images.length > 0 ? (
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          No Image
        </div>
      )}
      {/* Favorite Button */}
      <button
        onClick={(e) => onToggleWishlist(e, project.id!)}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none"
      >
        <Heart
          strokeWidth={1.5}
          className={`w-4 h-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </button>
    </div>

    <h3 className="text-base sm:text-[17px] font-semibold text-gray-900 mb-0.5 leading-tight truncate" title={project.title}>
      {project.title}
    </h3>

    <div className="mt-auto flex items-center justify-between gap-2 min-w-0 text-xs sm:text-[13px] text-gray-500 font-normal">
      <div className="flex items-center gap-1 min-w-0">
        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{project.location || 'Dubai'}</span>
      </div>
      {project.duration && (
        <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{project.duration}</span>
        </div>
      )}
    </div>
  </Link>
);

export const ExperienceCardSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="flex flex-col animate-pulse">
    <div className={`relative ${compact ? 'aspect-[16/10] sm:aspect-[4/3]' : 'aspect-[4/3]'} rounded-2xl sm:rounded-3xl mb-2.5 bg-gray-200`}>
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100" />
    </div>
    <div className="h-4 sm:h-[18px] w-3/4 bg-gray-200 rounded mb-1.5" />
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <div className="w-3.5 h-3.5 rounded-full bg-gray-200" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3.5 h-3.5 rounded-full bg-gray-200" />
        <div className="h-3 w-14 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export default ExperienceCard;
