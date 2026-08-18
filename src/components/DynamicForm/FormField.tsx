import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import type { FormFieldConfig } from './types';
import { CustomSelect } from './CustomSelect';
import { SingleImageUpload } from './SingleImageUpload';
import { MultiImageUpload } from './MultiImageUpload';

interface FormFieldProps {
  field: FormFieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, onBlur, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseInputClass = `w-full bg-white shadow-xs dark:bg-[#0f172a] text-black dark:text-white border border-border-subtle dark:border-gray-700 rounded px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none ${field.className?.input || ''}`;

  if (field.type === 'custom' && field.customRender) {
    return (
      <div className={`${field.className?.container || ''}`}>
        {field.customRender({ field, value, onChange, error })}
      </div>
    );
  }

  const renderInput = () => {
    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          value={value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={field.disabled}
          className={`${baseInputClass} ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...(field.extraProps || { rows: 4 })}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <CustomSelect
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          baseInputClass={baseInputClass}
        />
      );
    }

    if (field.type === 'multi-select') {
      const selectedValues = Array.isArray(value) ? value : [];
      const handleToggle = (optValue: string | number) => {
        if (selectedValues.includes(optValue)) {
          onChange(selectedValues.filter(v => v !== optValue));
        } else {
          onChange([...selectedValues, optValue]);
        }
      };

      return (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt, i) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  handleToggle(opt.value);
                  if (onBlur) onBlur();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm dark:bg-blue-600 dark:border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-[#0f172a] dark:text-gray-300 dark:border-gray-700 dark:hover:border-blue-900 dark:hover:bg-blue-900/20'
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (field.type === 'dynamic-list') {
      const listValues = Array.isArray(value) && value.length > 0 ? value : [''];
      const updateListItem = (index: number, val: string) => {
        const newValues = [...listValues];
        newValues[index] = val;
        onChange(newValues);
      };
      const addListItem = () => {
        onChange([...listValues, '']);
      };
      const removeListItem = (index: number) => {
        const newValues = listValues.filter((_, i) => i !== index);
        onChange(newValues.length ? newValues : ['']);
      };

      return (
        <div className="space-y-3">
          {listValues.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(index, e.target.value)}
                placeholder={field.placeholder || 'Enter value...'}
                className={baseInputClass}
              />
              <button
                type="button"
                onClick={() => removeListItem(index)}
                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addListItem}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
          >
            <Plus size={16} /> Add {field.label || 'Item'}
          </button>
        </div>
      );
    }

    if (field.type === 'multi-image') {
      return <MultiImageUpload value={value} onChange={onChange} />;
    }

    if (field.type === 'single-image') {
      return (
        <SingleImageUpload
          value={value}
          onChange={onChange}
          aspectRatio={field.aspectRatio}
          cropWidth={field.cropWidth}
          cropHeight={field.cropHeight}
          previewWidth={field.previewWidth}
          previewHeight={field.previewHeight}
        />
      );
    }

    if (field.type === 'password') {
      return (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name={field.name}
            value={value || ''}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={`${baseInputClass} pr-12`}
            {...(field.extraProps || {})}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      );
    }

    return (
      <input
        type={field.type || 'text'}
        name={field.name}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`${baseInputClass} ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...(field.extraProps || {})}
      />
    );
  };

  return (
    <div className={`mb-4 ${field.className?.container || ''}`}>
      {field.label && (
        <label className={`block text-sm font-medium text-black dark:text-gray-300 mb-1.5 ${field.className?.label || ''}`}>
          {field.label}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {field.description && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {field.description}
        </p>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
