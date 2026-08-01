import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, LayoutGrid, Sparkles, X, SlidersHorizontal } from 'lucide-react';

const MobileSearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const navigate = useNavigate();

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedVibe('');
  };

  const handleSearchSubmit = () => {
    setIsOpen(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (selectedVibe) {
      params.append('vibe', selectedVibe);
    }
    const queryString = params.toString();
    navigate(queryString ? `/projects?${queryString}` : '/projects');
  };

  return (
    <div className="w-full px-4 py-3 bg-white">
      {/* Collapsed Search Trigger Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-gray-200 rounded-full py-1.5 px-2 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#FF1645]/10 text-[#FF1645] flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {searchQuery ? searchQuery : 'Where to in Dubai?'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {selectedCategory || 'Any category'} • {selectedVibe || 'Any vibe'}
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 shrink-0 hover:bg-gray-50">
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
        </div>
      </button>

      {/* Expanded Full-Screen Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-[#F7F7F9] flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Top Sticky Header */}
          <div className="bg-white px-4 py-3.5 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none"
              aria-label="Close search"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <h3 className="font-medium text-base text-gray-900 ">Search Experiences</h3>
            <button
              onClick={handleClearAll}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 focus:outline-none"
            >
              Reset
            </button>
          </div>

          {/* Scrollable Content Sections */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Location Card */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-700" strokeWidth={1} />
                <h4 className="font-semibold text-gray-900 text-base">Where do you want to go?</h4>
              </div>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, area or landmark..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-10 md:text-sm text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-normal"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {/* Quick Location Suggestions */}
              <div className="mt-4">
                <p className="text-[11px] font-medium   text-gray-400 mb-2">Popular Areas</p>
                <div className="flex flex-wrap gap-2">
                  {['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Desert Safari', 'Burj Khalifa', 'Jumeirah Beach'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSearchQuery(searchQuery === loc ? '' : loc)}
                      className={`text-xs px-3.5 py-2 rounded-lg border transition-all font-medium ${searchQuery === loc ? 'bg-black text-white border-black shadow-xs' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Card */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <LayoutGrid className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                <h4 className="font-semibold text-gray-900 text-base">Select Category</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Yacht rental', 'Desert safaris', 'Theme Parks', 'Water Activities', 'Adventure', 'Cruises', 'Helicopter'].map((cat) => {
                  const isSelected = (selectedCategory === cat) || (!selectedCategory && cat === 'All');
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                      className={`text-xs px-3 py-2 rounded-lg border transition-all font-medium ${isSelected ? 'bg-black text-white border-black shadow-xs' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vibe Card */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-gray-700" strokeWidth={1} />
                <h4 className="font-semibold text-gray-900 text-base">Select Vibe</h4>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {['Adventure & Thrill', 'Family Friendly', 'Romantic Escape', 'Luxury & VIP', 'Relax & Chill', 'Nightlife & Fun'].map((vibe) => {
                  const isSelected = selectedVibe === vibe;
                  return (
                    <button
                      key={vibe}
                      onClick={() => setSelectedVibe(isSelected ? '' : vibe)}
                      className={`text-xs p-2.5 rounded-lg border text-left font-medium transition-all flex items-center justify-between ${isSelected ? 'bg-black text-white border-black shadow-xs' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <span className="truncate pr-1">{vibe}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Footer Action */}
          <div className="bg-white px-4 py-4 border-t border-gray-200 sticky bottom-0 z-10 flex items-center gap-4 shadow-lg">
            <button
              onClick={handleClearAll}
              className="w-1/3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors  text-center focus:outline-none"
            >
              Clear all
            </button>
            <button
              onClick={handleSearchSubmit}
              className="flex-1 bg-[#FF1645] hover:bg-[#e00d38] text-white py-3.5 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#FF1645]/25 transition-all active:scale-[0.98]"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
              <span>Search Experiences</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
