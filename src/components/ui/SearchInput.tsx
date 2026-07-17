import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  /**
   * The current search query value
   */
  value: string;

  /**
   * Callback event triggered when search input value changes (or clears)
   */
  onChange: (value: string) => void;

  /**
   * Optional placeholder string for the search text field
   */
  placeholder?: string;

  /**
   * Optional custom styling classes for the container wrapper
   */
  className?: string;

  /**
   * Optional custom styling classes for the input element itself
   */
  inputClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Left Search Icon */}
      <Search strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      {/* Input Element */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-9 pr-9 py-3 w-52 sm:w-80 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] transition-all ${inputClassName}`}
      />

      {/* Absolute Clear Action Trigger (shows only when input is populated) */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
