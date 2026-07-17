import React, { useMemo } from 'react';

interface GoogleMapPreviewInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const GoogleMapPreviewInput: React.FC<GoogleMapPreviewInputProps> = ({ value, onChange, placeholder }) => {
  // Extract src from iframe if user pasted the entire HTML snippet
  const mapSrc = useMemo(() => {
    if (!value) return null;
    
    // Check if it's an iframe snippet
    if (value.trim().toLowerCase().startsWith('<iframe')) {
      const srcMatch = value.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
    }
    
    // If it's just a raw URL
    if (value.startsWith('http')) {
      return value;
    }
    
    return null;
  }, [value]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Paste Google Maps embedded URL or iframe here...'}
        className="w-full bg-white shadow-xs dark:bg-[#0f172a] text-black dark:text-white border border-border-subtle dark:border-gray-700 rounded px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
      />
      
      {mapSrc ? (
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Preview"
            className="w-full h-full"
          ></iframe>
        </div>
      ) : value ? (
        <div className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center flex items-center justify-center h-32">
          Invalid Google Maps Embed URL or iframe code
        </div>
      ) : null}
    </div>
  );
};
