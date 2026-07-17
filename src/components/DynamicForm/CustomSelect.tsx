import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FormFieldConfig } from './types';

interface CustomSelectProps {
  field: FormFieldConfig;
  value: any;
  onChange: (val: any) => void;
  onBlur?: () => void;
  baseInputClass: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  field,
  value,
  onChange,
  onBlur,
  baseInputClass,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen && onBlur) onBlur();
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const selectedOption = field.options?.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`${baseInputClass} pr-10 cursor-pointer flex items-center justify-between ${!selectedOption ? 'text-gray-400 dark:text-gray-500' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : (field.placeholder || 'Select...')}</span>
        <ChevronDown size={18} className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''} text-gray-400`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full z-50 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto">
          {field.options?.map((opt, i) => (
            <div
              key={i}
              className={`px-4 py-3 cursor-pointer text-sm transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0 ${opt.value === value
                ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50'
                }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
                if (onBlur) onBlur();
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
