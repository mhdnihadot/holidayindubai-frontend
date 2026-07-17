import React, { useState } from 'react';
import { Trash2, Plus, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface IconListItem {
  icon: string;
  text: string;
  description?: string;
}

interface DynamicIconListProps {
  value: any;
  onChange: (val: any) => void;
  label?: string;
  placeholder?: string;
  hasDescription?: boolean;
}

export const DynamicIconList: React.FC<DynamicIconListProps> = ({ value, onChange, label, placeholder, hasDescription }) => {
  const items: IconListItem[] = Array.isArray(value) ? value : [];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addItem = () => {
    onChange([...items, { icon: '', text: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateText = (index: number, text: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text };
    onChange(newItems);
  };

  const updateDescription = (index: number, description: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], description };
    onChange(newItems);
  };

  const handleIconUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
        throw new Error('Cloudinary config missing in .env');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload icon');
      }

      const data = await res.json();
      const newItems = [...items];
      newItems[index] = { ...newItems[index], icon: data.secure_url };
      onChange(newItems);
      toast.success('Icon uploaded!');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading icon');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
          
          <div className="relative group shrink-0">
            {item.icon ? (
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                <img src={item.icon} alt="icon" className="w-8 h-8 object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
                {uploadingIndex === index ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
              </div>
            )}
            
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
              <UploadCloud size={16} />
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleIconUpload(index, file);
                }}
              />
            </label>
          </div>

              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateText(index, e.target.value)}
                  placeholder={placeholder || `Enter ${label?.toLowerCase() || 'item'} text...`}
                  className="w-full bg-white dark:bg-[#0f172a] text-black dark:text-white border border-border-subtle dark:border-gray-700 rounded px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                {hasDescription && (
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    placeholder={`Enter ${label?.toLowerCase() || 'item'} description...`}
                    className="w-full bg-white dark:bg-[#0f172a] text-black dark:text-gray-300 border border-border-subtle dark:border-gray-700 rounded px-4 py-2 text-sm outline-none focus:border-blue-500"
                  />
                )}
              </div>

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors shrink-0"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Plus size={16} /> Add {label || 'Item'}
      </button>
    </div>
  );
};
