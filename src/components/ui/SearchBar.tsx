import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LayoutGrid, Sparkles, Search, X } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasText, setHasText] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close search when clicking outside if input is empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (inputRef.current?.value === '') {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Small delay to allow layout transition to start before focusing, 
      // ensuring the keyboard doesn't abruptly interrupt the smooth slide.
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setHasText(false);
    setIsExpanded(false);
  };

  const handleSearch = () => {
    if (inputRef.current?.value) {
      navigate(`/projects?search=${encodeURIComponent(inputRef.current.value)}`);
    } else {
      navigate('/projects');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex justify-center py-6 bg-white">
      <div
        ref={containerRef}
        className={`bg-white rounded-full p-2 flex items-center  border border-gray-200 mx-4 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'max-w-3xl w-full' : 'max-w-4xl w-full'}`}
      >

        {/* Location Section */}
        <div
          onClick={handleExpand}
          className={`flex items-center hover:bg-gray-100/50 h-full px-6 py-0 gap-4 cursor-pointer  rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'flex-[1_0_0%] min-w-0 bg-white shadow-sm ring-1 ring-gray-200' : 'flex-1 min-w-[150px]'}`}
        >
          <MapPin className={`w-6 h-6 shrink-0 transition-colors duration-500 ${isExpanded ? 'text-black' : 'text-black'}`} strokeWidth={1} />

          <div className="relative flex-1 h-8 flex items-center overflow-hidden">
            {/* Static Text (Collapsed) */}
            <div className={`absolute inset-0 flex flex-col justify-center whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <span className="text-black font-medium text-[15px] ">Location</span>
              <span className="text-gray-500 text-xs">Search city or area</span>
            </div>

            {/* Input (Expanded) */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a city, area or project..."
              onChange={(e) => setHasText(e.target.value.length > 0)}
              onKeyDown={handleKeyDown}
              className={`absolute inset-0 w-[calc(100%-30px)] h-full bg-transparent outline-none text-base text-black placeholder:text-gray-400 font-normal transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className={`absolute right-0  rounded-full text-gray-600 transition-all duration-300 ${isExpanded && hasText ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
            >
              <X className="w-5s h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Divider 1 */}
        <div className={`h-10 bg-gray-300 mx-2 transition-all duration-500 ease-in-out ${isExpanded ? 'w-[1px] opacity-100 mx-2' : 'w-[1px] opacity-100'}`}></div>

        {/* Category Section */}
        <div className={`flex items-center  h-full cursor-pointer hover:bg-gray-100/50 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'px-4 py-2 flex-none' : 'flex-1 px-6 py-0 gap-4'}`}>
          <LayoutGrid className="w-6 h-6 text-black shrink-0" strokeWidth={1} />
          <div className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}>
            <span className="text-black font-medium text-[15px] ">Category</span>
            <span className="text-gray-500 text-xs">Select Category</span>
          </div>
        </div>

        {/* Divider 2 */}
        <div className={`h-10 mx-2 bg-gray-300 transition-all duration-500 ease-in-out ${isExpanded ? 'w-0 opacity-0 mx-0' : 'w-[1px] opacity-100'}`}></div>

        {/* Vibe Section */}
        <div className={`flex items-center  h-full cursor-pointer hover:bg-gray-100/50 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${isExpanded ? 'max-w-0 opacity-0 px-0' : 'flex-1 px-6 gap-4'}`}>
          <Sparkles className="w-6 h-6 text-black shrink-0" strokeWidth={1} />
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-black font-medium text-[15px] ">Vibe</span>
            <span className="text-gray-500 text-xs">Adventure, Family..</span>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleSearch(); }}
          className={`bg-[#FF1645] hover:bg-[#f80d3c] ms-2 text-white rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex-shrink-0  ${isExpanded ? 'w-14 h-14' : 'w-12 h-12'}`}
        >
          <Search className="w-6 h-6" strokeWidth={1.5} />
        </button>

      </div>
    </div>
  );
};

export default SearchBar;
