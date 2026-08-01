import React, { useState } from 'react';

const categories = [
  {
    id: 1,
    name: 'Landmarks & Sightseeing',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21c4-2 10-2 14 0" />
        <path d="M10 20c0-3.5 1-7 2-10" />
        <path d="M14 20c0-3.5-1-7-2-10" />
        <path d="M12 10c-3-3-8-2-9 1 3 1 6 1 9-1Z" />
        <path d="M12 10c3-3 8-2 9 1-3 1-6 1-9-1Z" />
        <path d="M12 10c-2-6 1-8 4-8-1 3-2 5-4 8Z" />
        <path d="M12 10c2-6-1-8-4-8 1 3 2 5 4 8Z" />
        <path d="M10.5 16h3" />
        <path d="M11 13h2" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Desert & Nature Experiences',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 16l4.5-4.5 4 4 5-6 4.5 5" />
        <circle cx="7.5" cy="8.5" r="1.5" />
        <path d="M17 17v-6" />
        <path d="M15 13v-1c0-.6.4-1 1-1h1" />
        <path d="M19 14v-1.5c0-.6-.4-1-1-1h-1" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Water & Marine Activities',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19c3.5 0 6-2 9-6 3-4 7.5-6 10-2 2 3 0 7-3.5 7-2.5 0-4-1.5-3-3.5 1-1.5 3-2 4-1" />
        <path d="M7 16l4-4" />
        <circle cx="11.5" cy="8.5" r="1" />
        <path d="M9.5 12l1-2 1.5-0.5" />
        <path d="M8 10.5l2.5-1 2 1" />
        <path d="M3 21h16" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Adventure & Thrill Activities',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 3.5 2.5 6 4.5 7.5h6c2-1.5 4.5-4 4.5-7.5A7.5 7.5 0 0 0 12 2Z" />
        <path d="M12 2v15" />
        <path d="M8 3c1 3.5 1 8.5 0 13" />
        <path d="M16 3c-1 3.5-1 8.5 0 13" />
        <path d="M9 19v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2" />
        <path d="M9.5 17v2" />
        <path d="M14.5 17v2" />
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Theme Parks & Entertainment',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <circle cx="12" cy="9" r="1.5" />
        <path d="M12 3v12" />
        <path d="M6 9h12" />
        <path d="M7.76 4.76l8.48 8.48" />
        <path d="M16.24 4.76l-8.48 8.48" />
        <path d="M12 10l-4.5 11" />
        <path d="M12 10l4.5 11" />
        <path d="M5 21h14" />
        <path d="M9 21v-2.5l3-1.5 3 1.5V21" />
      </svg>
    ),
  },
  {
    id: 6,
    name: 'Family & Kids Activities',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <path d="M3 17a4 4 0 0 1 7-0.5" />
        <path d="M21 17a4 4 0 0 0-7-0.5" />
        <circle cx="12" cy="11.5" r="2" />
        <path d="M8.5 20a3.5 3.5 0 0 1 7 0" />
      </svg>
    ),
  },
  {
    id: 7,
    name: 'Culture, Art & Heritage',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C6.5 3 2 7.5 2 13c0 5 4.5 8 9.5 8 1 0 1.5-.5 1.5-1.5 0-.6-.5-1-.5-1.5 0-1 .8-2 2-2h1c3.5 0 6.5-2.5 6.5-6.5C22 5 17.5 3 12 3Z" />
        <circle cx="7.5" cy="10.5" r="1" />
        <circle cx="10.5" cy="7.5" r="1" />
        <circle cx="14.5" cy="7.5" r="1" />
        <circle cx="7.5" cy="15" r="1" />
        <path d="M17.5 12.5l3.5-3.5a1.5 1.5 0 0 0-2-2l-3.5 3.5" />
      </svg>
    ),
  },
  {
    id: 8,
    name: 'Food, Dining & Nightlife',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 17v-4" />
        <path d="M7.5 7.5v3a1.5 1.5 0 0 0 3 0v-3" />
        <path d="M9 7v3" />
        <path d="M15 17v-6.5c1 0 2-1 2-2.5 0-2-1-2-2-2v11Z" />
      </svg>
    ),
  },
  {
    id: 9,
    name: 'Luxury & Shopping',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 10,
    name: 'Spa & Wellness',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 12c-2.76 0-5-2.24-5-5" />
        <path d="M12 12c2.76 0 5-2.24 5-5" />
        <path d="M12 12c0 2.76-2.24 5-5 5" />
        <path d="M12 12c0 2.76 2.24 5 5 5" />
      </svg>
    ),
  },
  {
    id: 11,
    name: 'Sports & Golf',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M12 2v6" />
        <path d="M12 16v6" />
        <path d="M22 12h-6" />
        <path d="M8 12H2" />
      </svg>
    ),
  },
  {
    id: 12,
    name: 'Cruises & Yachting',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" />
        <path d="M4 20v-5c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v5" />
        <path d="M12 12V4" />
        <path d="M12 4l6 4-6 4" />
      </svg>
    ),
  },
  {
    id: 13,
    name: 'Guided Tours',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    id: 14,
    name: 'Air Tours & Helicopters',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M21 15.5l-6-1.5L13.5 10l-1.5 5.5-5 1.5L2 15.5" />
        <path d="M12 22v-4" />
        <path d="M8 22h8" />
      </svg>
    ),
  },
  {
    id: 15,
    name: 'Events & Festivals',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4z" />
        <path d="M12 11v8" />
        <path d="M12 3v2" />
        <path d="M8 3v2" />
        <path d="M16 3v2" />
      </svg>
    ),
  },
  {
    id: 16,
    name: 'Staycations & Hotels',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h6" />
      </svg>
    ),
  },
  {
    id: 17,
    name: 'Transportation & Rentals',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H6a2 2 0 0 0-2 2v7.55" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    ),
  },
];

const CategoryFilter: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const mainCategories = categories.slice(0, 8);
  const extraCategories = categories.slice(8);

  return (
    <div className="w-full">
      {/* Mobile View: Horizontal Scrollable Category Strip (< 640px) */}
      <div className="sm:hidden w-full px-4 mt-2 mb-6">
        <h2 className="text-base font-semibold text-gray-900 pb-2">Explore by Category</h2>
        <div
          className="overflow-x-auto -mx-4 px-4 pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-stretch gap-2.5 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex flex-col items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-black hover:bg-gray-50 text-center w-[140px] h-[94px] transition-all flex-shrink-0 group focus:outline-none"
              >
                <div className="w-8 h-8 flex items-center justify-center text-gray-600 group-hover:text-black group-hover:scale-105 transition-all">
                  <div className="scale-90 flex items-center justify-center">
                    {category.icon}
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-700 group-hover:text-black leading-tight line-clamp-2 w-full mt-1">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet & Desktop View: Grid with Expandable Accordion (>= 640px) */}
      <div className="hidden sm:block w-full max-w-[1200px] mx-auto px-6 xl:px-0 mt-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl lg:rounded-3xl p-5 lg:p-6 shadow-xs">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 px-2 pb-2">Explore by Category</h2>

          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3 lg:gap-1">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                  {category.icon}
                </div>
                <span className="text-xs font-normal text-gray-500 group-hover:text-gray-900 transition-colors leading-tight mt-1 max-w-[90%] line-clamp-2">
                  {category.name}
                </span>
              </button>
            ))}

            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] md:w-[30px] md:h-[30px]">
                    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
                    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
                    <path d="M17 13.5v7" />
                    <path d="M13.5 17h7" />
                  </svg>
                </div>
                <span className="text-xs leading-tight font-normal text-gray-500 group-hover:text-gray-900 transition-colors mt-1 max-w-[90%] line-clamp-2">
                  More Categories
                </span>
              </button>
            )}
          </div>

          <div
            className="grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ gridTemplateRows: showAll ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3 lg:gap-1 pt-3 md:pt-4">
                {extraCategories.map((category) => (
                  <button
                    key={category.id}
                    className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                      {category.icon}
                    </div>
                    <span className="text-xs font-normal text-gray-500 group-hover:text-gray-900 transition-colors leading-tight mt-1 max-w-[90%] line-clamp-2">
                      {category.name}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => setShowAll(false)}
                  className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
                >
                  <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] md:w-[30px] md:h-[30px]">
                      <path d="M5 12h14" />
                    </svg>
                  </div>
                  <span className="text-xs leading-tight font-medium text-gray-500 group-hover:text-gray-900 transition-colors mt-1 max-w-[90%] line-clamp-2">
                    Show Less
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
