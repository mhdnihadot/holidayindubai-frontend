import React, { useState, useEffect, useId } from 'react';
import { categoryService } from '@/services/category.service';
import type { Category } from '@/services/category.service';

interface CategoryAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CategoryAutocompleteInput: React.FC<CategoryAutocompleteInputProps> = ({ value, onChange, placeholder }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const datalistId = useId();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data || response || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        list={datalistId}
        placeholder={placeholder || 'E.g., Water & Marine Activities'}
        className="w-full bg-white shadow-xs dark:bg-[#0f172a] text-black dark:text-white border border-border-subtle dark:border-gray-700 rounded px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
      />
      <datalist id={datalistId}>
        {categories.map((cat, idx) => (
          <option key={cat._id || idx} value={cat.name} />
        ))}
      </datalist>
    </div>
  );
};
