import React from 'react';
import { Trash2, Plus } from 'lucide-react';

interface StepListItem {
  title: string;
  content: string;
}

interface DynamicStepsListProps {
  value: any;
  onChange: (val: any) => void;
  label?: string;
}

export const DynamicStepsList: React.FC<DynamicStepsListProps> = ({ value, onChange, label }) => {
  const items: StepListItem[] = Array.isArray(value) ? value : [];

  const addItem = () => {
    onChange([...items, { title: '', content: '' }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof StepListItem, text: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: text };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 relative group">
          
          <div className="flex-1 w-full space-y-3">
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Step Title (e.g., Arrival & Boarding)"
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            
            <textarea
              value={item.content}
              onChange={(e) => updateItem(index, 'content', e.target.value)}
              placeholder="Step Content (e.g., Board near Dubai Marina...)"
              rows={2}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
          </div>

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors shrink-0 sm:mt-1"
          >
            <Trash2 size={18} />
          </button>

          {/* Number badge */}
          <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white dark:border-gray-900">
            {index + 1}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
      >
        <Plus size={16} /> Add {label || 'Step'}
      </button>
    </div>
  );
};
