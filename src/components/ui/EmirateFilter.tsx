import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/project.service';

const INITIAL_EMIRATES = [
  {
    id: 1,
    name: 'Dubai',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/dubai_tourist_1784109879840.png',
  },
  {
    id: 7,
    name: 'Abu Dhabi',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/abudhabi_tourist_1784109954112.png',
  },
  {
    id: 2,
    name: 'Sharjah',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/sharjah_tourist_1784109891738.png',
  },
  {
    id: 5,
    name: 'Ras Al Khaimah',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/rak_tourist_1784109929657.png',
  },
  {
    id: 3,
    name: 'Ajman',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/ajman_tourist_1784109903047.png',
  },
  {
    id: 4,
    name: 'Umm Al Quwain',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/uaq_tourist_1784109917460.png',
  },
  {
    id: 6,
    name: 'Fujairah',
    experiences: 0,
    distance: '62 Km',
    image: '/images/emirates/fujairah_tourist_1784109941282.png',
  },
];

const EmirateFilter: React.FC = () => {
  const [emirates, setEmirates] = useState(INITIAL_EMIRATES);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await projectService.getCountsByEmirate();
        if (response && response.data) {
          const counts = response.data;
          setEmirates(prev => prev.map(emp => {
            const match = counts.find((c: any) => c._id === emp.name);
            return { ...emp, experiences: match ? match.count : 0 };
          }));
        }
      } catch (error) {
        console.error('Failed to fetch emirate counts', error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="w-full">
      {/* Mobile View: Horizontal Scrollable Carousel (< 640px) */}
      <div className="sm:hidden w-full px-4 mb-8">
        <h2 className="text-base font-semibold text-gray-900 pb-2">Explore by Emirate</h2>
        <div
          className="overflow-x-auto -mx-4 px-4 pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-start gap-3.5 min-w-max">
            {emirates.map((emirate) => (
              <Link
                key={emirate.id}
                to={`/projects?emirate=${emirate.name.toLowerCase().replace(/ /g, '-')}`}
                className="group flex-shrink-0 w-[140px] flex flex-col items-start focus:outline-none"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square rounded-[20px] overflow-hidden mb-2.5 bg-gray-100 shadow-xs transition-all">
                  <img
                    src={emirate.image}
                    alt={emirate.name}
                    className="w-full h-full object-cover  transition-transform duration-500"
                  />
                </div>

                {/* Text Information */}
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5 group-hover:text-black transition-colors truncate w-full">
                  {emirate.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-normal">
                  {emirate.experiences} Experiences
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet & Desktop View: Responsive Grid (>= 640px) */}
      <div className="hidden sm:block w-full max-w-[1200px] mx-auto px-6 xl:px-0 mb-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 pb-5">Explore by Emirate</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {emirates.map((emirate) => (
            <Link
              key={emirate.id}
              to={`/projects?emirate=${emirate.name.toLowerCase().replace(/ /g, '-')}`}
              className="group w-full flex flex-col items-start focus:outline-none"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square rounded-[24px] lg:rounded-[28px] overflow-hidden mb-3 bg-gray-100 shadow-xs group-hover:shadow-md transition-all">
                <img
                  src={emirate.image}
                  alt={emirate.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              </div>

              {/* Text Information */}
              <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-black transition-colors">
                {emirate.name}
              </h3>
              <p className="text-xs md:text-[13px] text-gray-500 font-normal">
                {emirate.experiences} Experiences
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmirateFilter;
