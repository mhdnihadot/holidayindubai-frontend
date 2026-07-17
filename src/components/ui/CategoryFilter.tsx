import React, { useState } from 'react';

const categories = [
  {
    id: 1,
    name: 'Landmarks & Sightseeing',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V4" />
        <path d="M8 22V10l4-6 4 6v12" />
        <path d="M4 22v-6l4-4" />
        <path d="M20 22v-6l-4-4" />
        <path d="M2 22h20" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Desert & Nature Experiences',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M2 16h20" />
        <path d="M12 12c0-3.3-2.7-6-6-6S0 8.7 0 12" />
        <path d="M24 12c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
        <circle cx="17" cy="5" r="2" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Water & Marine Activities',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12c2.2 0 4-1.8 4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4" />
        <path d="M10 12c2.2 0 4-1.8 4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Adventure & Thrill Activities',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C7.58 2 4 5.58 4 10c0 4.2 3.1 7.64 7 8.16v3.84h2v-3.84c3.9-.52 7-3.96 7-8.16 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
        <path d="M12 4v12" />
        <path d="M6 10h12" />
        <path d="M7.76 5.76l8.48 8.48" />
        <path d="M16.24 5.76l-8.48 8.48" />
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Theme Parks & Entertainment',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M5.6 5.6l12.8 12.8" />
        <path d="M18.4 5.6L5.6 18.4" />
        <path d="M12 22l-4 2" />
        <path d="M12 22l4 2" />
      </svg>
    ),
  },
  {
    id: 6,
    name: 'Family & Kids Activities',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 7,
    name: 'Culture, Art & Heritage',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.07 0 2-.93 2-2 0-.54-.22-1.03-.57-1.39-.36-.37-.58-.87-.58-1.41 0-1.07.93-2 2-2h1.67C19.5 17.2 22 14.7 22 11.5 22 6.25 17.52 2 12 2zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4 11 4.67 11 5.5 10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4 16 4.67 16 5.5 15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8 19 8.67 19 9.5 18.33 11 17.5 11z" />
      </svg>
    ),
  },
  {
    id: 8,
    name: 'Food, Dining & Nightlife',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M9 12v9" />
        <path d="M9 12V3" />
        <path d="M6 12V3" />
        <path d="M12 12V3" />
        <path d="M15 12c0-2.2 1.8-4 4-4v13" />
      </svg>
    ),
  },
  {
    id: 9,
    name: 'Luxury & Shopping',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    id: 14,
    name: 'Air Tours & Helicopters',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H6a2 2 0 0 0-2 2v7.55" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    ),
  },
];

const CategoryFilter: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const mainCategories = categories.slice(0, 9);
  const extraCategories = categories.slice(9);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 mt-4 mb-8">
      <div className="bg-white border border-gray-200 rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 px-2 pb-0">Explore by Category</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-0">
          {mainCategories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center justify-start text-center p-2 transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-colors">
                {category.icon}
              </div>
              <span className="text-[11px] font-normal text-gray-500 group-hover:text-gray-900 transition-colors max-w-[90%]">
                {category.name}
              </span>
            </button>
          ))}

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="flex flex-col items-center justify-start text-center p-2 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-colors mb-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <path d="M3 14h7v7H3z" />
                  <path d="M6 17.5h1" />
                  <path d="M6.5 17v1" />
                </svg>
              </div>
              <span className="text-[11px] leading-tight font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 pt-4">
              {extraCategories.map((category) => (
                <button
                  key={category.id}
                  className="flex flex-col items-center justify-start text-center p-2 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-colors">
                    {category.icon}
                  </div>
                  <span className="text-[11px] font-normal text-gray-500 group-hover:text-gray-900 transition-colors max-w-[90%]">
                    {category.name}
                  </span>
                </button>
              ))}

              <button
                onClick={() => setShowAll(false)}
                className="flex flex-col items-center justify-start text-center p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-12 h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-colors mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                  </svg>
                </div>
                <span className="text-[11px] leading-tight font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                  Show Less
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
