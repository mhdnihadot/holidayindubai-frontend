import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/category.service';

import { 
  Map, Tent, Compass, Anchor, Sailboat, Palmtree, Mountain, Umbrella, 
  Plane, Car, Bike, Train, Bus, Ship, Ticket, Camera, Binoculars, 
  MapPin, Navigation, Globe, Sun, Moon, Cloud, Star, Snowflake, Flame, 
  Trees, TreePine, Droplet, Fish, Bird, Bug, Flower, Leaf, Shield, 
  Crown, Gem, Gift, Heart, Music, Video, Gamepad, Utensils, Coffee, 
  Wine, Beer, Cake, ShoppingBag, ShoppingCart, Tag, Book, Briefcase, 
  Building, Castle, Factory, Home, Hotel, Store, Wrench, Zap 
} from 'lucide-react';

const iconPool = [
  Map, Tent, Compass, Anchor, Sailboat, Palmtree, Mountain, Umbrella, 
  Plane, Car, Bike, Train, Bus, Ship, Ticket, Camera, Binoculars, 
  MapPin, Navigation, Globe, Sun, Moon, Cloud, Star, Snowflake, Flame, 
  Trees, TreePine, Droplet, Fish, Bird, Bug, Flower, Leaf, Shield, 
  Crown, Gem, Gift, Heart, Music, Video, Gamepad, Utensils, Coffee, 
  Wine, Beer, Cake, ShoppingBag, ShoppingCart, Tag, Book, Briefcase, 
  Building, Castle, Factory, Home, Hotel, Store, Wrench, Zap
];

const getCategoryIcon = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  const IconComponent = iconPool[hash % iconPool.length];
  return <IconComponent strokeWidth={1} className="w-[30px] h-[30px]" />;
};

const CategoryFilter: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response && response.data) {
          setDbCategories(response.data.map((c: any) => c.name));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = dbCategories.map((name, index) => ({
    id: index,
    name,
    icon: getCategoryIcon(name)
  }));
  
  const mainCategories = displayCategories.slice(0, 8);
  const extraCategories = displayCategories.slice(8);


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
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                to={`/projects?category=${encodeURIComponent(category.name)}`}
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
              </Link>
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
              <Link
                key={category.id}
                to={`/projects?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                  {category.icon}
                </div>
                <span className="text-xs font-normal text-gray-500 group-hover:text-gray-900 transition-colors leading-tight mt-1 max-w-[90%] line-clamp-2">
                  {category.name}
                </span>
              </Link>
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
                  <Link
                    key={category.id}
                    to={`/projects?category=${encodeURIComponent(category.name)}`}
                    className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                      {category.icon}
                    </div>
                    <span className="text-xs font-normal text-gray-500 group-hover:text-gray-900 transition-colors leading-tight mt-1 max-w-[90%] line-clamp-2">
                      {category.name}
                    </span>
                  </Link>
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
