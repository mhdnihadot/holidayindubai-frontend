import React from 'react';
import { Link } from 'react-router-dom';

const emirates = [
  {
    id: 1,
    name: 'Dubai',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/dubai_tourist_1784109879840.png',
  },
  {
    id: 2,
    name: 'Sharjah',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/sharjah_tourist_1784109891738.png',
  },
  {
    id: 3,
    name: 'Ajman',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/ajman_tourist_1784109903047.png',
  },
  {
    id: 4,
    name: 'Umm Al Quwain',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/uaq_tourist_1784109917460.png',
  },
  {
    id: 5,
    name: 'Ras Al Khaimah',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/rak_tourist_1784109929657.png',
  },
  {
    id: 6,
    name: 'Fujairah',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/fujairah_tourist_1784109941282.png',
  },
  {
    id: 7,
    name: 'Abu Dhabi',
    experiences: 654,
    distance: '62 Km',
    image: '/images/emirates/abudhabi_tourist_1784109954112.png',
  },
];

const EmirateFilter: React.FC = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 pb-6 px-2">Explore by Emirate</h2>

      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4 md:grid md:grid-cols-4 lg:grid-cols-7 md:gap-6 px-2">
        {emirates.map((emirate) => (
          <Link
            key={emirate.id}
            to={`/projects?emirate=${emirate.name.toLowerCase().replace(/ /g, '-')}`}
            className="group flex-shrink-0 w-[140px] md:w-auto flex flex-col items-start"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square rounded-[28px] overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={emirate.image}
                alt={emirate.name}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              {/* Distance Badge */}
              {/* <div className="absolute top-4 left-4">
                <span className="bg-white/80 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm">
                  {emirate.distance}
                </span>
              </div> */}
            </div>

            {/* Text Information */}
            <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-black transition-colors">
              {emirate.name}
            </h3>
            <p className="text-[12px] text-gray-500 font-normal">
              {emirate.experiences} Experiences
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EmirateFilter;
