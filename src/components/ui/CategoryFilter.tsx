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

const getCategoryIconComponent = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return iconPool[hash % iconPool.length];
};

const getCategoryIcon = (name: string) => {
  const IconComponent = getCategoryIconComponent(name);
  return <IconComponent strokeWidth={1.5} className="w-[30px] h-[30px]" />;
};

const CategoryFilter: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response && response.data) {
          setDbCategories(response.data.map((c: any) => c.name));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = dbCategories.map((name, index) => ({
    id: index,
    name,
    icon: getCategoryIcon(name),
    Icon: getCategoryIconComponent(name)
  }));
  
  const mainCategories = displayCategories.slice(0, 8);
  const extraCategories = displayCategories.slice(8);


  return (
    <div className="w-full">
      {/* Mobile View: single row that scrolls sideways — ~4 visible, next one peeks (< 640px) */}
      <div className="sm:hidden w-full px-4 mt-2 mb-6">
        <h2 className="text-base font-semibold text-gray-900 pb-3">Explore by Category</h2>
        <div
          className="overflow-x-auto -mx-4 px-4 snap-x snap-mandatory scroll-px-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="grid grid-flow-col auto-cols-[calc((100vw-3.5rem)/4.3)] gap-x-2 w-max">
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 animate-pulse">
                <div className="w-14 h-14 rounded-lg bg-gray-100" />
                <div className="h-2 w-12 bg-gray-100 rounded" />
              </div>
            ))}
            {displayCategories.map(({ id, name, Icon }) => (
              <Link
                key={id}
                to={`/projects?category=${encodeURIComponent(name)}`}
                className="snap-start flex flex-col items-center gap-1.5 text-center focus:outline-none group"
              >
                <span className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-50 text-gray-800 group-active:bg-gray-100 transition-colors">
                  <Icon className="w-6 h-6" strokeWidth={1} />
                </span>
                <span className="text-[11px] font-normal text-gray-600 leading-tight line-clamp-2">{name}</span>
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
            {isLoading && Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-2 animate-pulse">
                <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center">
                  <div className="w-[30px] h-[30px] rounded-md bg-gray-200" />
                </div>
                <div className="h-2.5 w-16 bg-gray-200 rounded mt-2" />
                <div className="h-2.5 w-10 bg-gray-200 rounded mt-1.5" />
              </div>
            ))}
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

            {!showAll && !isLoading && (
              <button
                onClick={() => setShowAll(true)}
                className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-200">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] md:w-[30px] md:h-[30px]">
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
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] md:w-[30px] md:h-[30px]">
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
