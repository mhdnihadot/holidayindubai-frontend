import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

interface MultiImageUploadProps {
  value: any;
  onChange: (val: any) => void;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ value, onChange }) => {
  const images = Array.isArray(value) ? value : [];
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingFileName, setProcessingFileName] = useState('');

  const handleMultiImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // Reset input

    if (files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
    const MAX_SAFE_SIZE = 10 * 1024 * 1024; // 10MB

    let hasOversized = false;
    let hasInvalidType = false;

    const validFiles = files.filter(f => {
      if (!allowedTypes.includes(f.type)) {
        hasInvalidType = true;
        return false;
      }
      if (f.size > MAX_SAFE_SIZE) {
        hasOversized = true;
        return false;
      }
      return true;
    });

    if (hasInvalidType) {
      toast.error('Some files were ignored. Only PNG, JPG, WEBP, or AVIF are allowed.');
    }
    if (hasOversized) {
      toast.error('Some files were ignored because they exceed the 10MB limit.');
    }

    if (validFiles.length === 0) return;

    setIsCompressing(true);
    const newUrls: string[] = [];

    const uploadToCloudinary = async (file: File | Blob): Promise<string> => {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
        throw new Error('Cloudinary config missing in .env. Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to upload to Cloudinary');
      }
      const data = await res.json();
      return data.secure_url;
    };

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setProcessingFileName(`(${i + 1}/${validFiles.length}) ${file.name}`);
      setProgress(0);

      try {
        const options = {
          maxSizeMB: 0.3, // Target 300KB for high-quality WebP
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp' as any,
          initialQuality: 0.8,
          onProgress: (p: number) => setProgress(p),
        };
        const compressedBlob = await imageCompression(file, options);
        setProcessingFileName(`Uploading ${file.name} to Cloudinary...`);
        const url = await uploadToCloudinary(compressedBlob);
        newUrls.push(url);
      } catch (error: any) {
        console.error('Compression/Upload error:', error);
        toast.error(error.message || `Failed to process ${file.name}`);
      }
    }

    onChange([...images, ...newUrls]);
    setIsCompressing(false);
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className={`relative border-2 border-dashed ${isCompressing ? 'border-blue-500' : 'border-border-subtle dark:border-gray-700'} rounded-xl bg-[#f8fafc] dark:bg-[#0f172a]/50 transition-colors group overflow-hidden`}>
        {isCompressing ? (
          <div className="flex flex-col items-center justify-center py-8 px-6 text-center bg-blue-50/50 dark:bg-blue-900/10">
            <div className="w-full max-w-xs mx-auto mb-4">
              <div className="flex justify-between text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                <span>Optimizing to WebP...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 truncate max-w-[250px]">
              {processingFileName}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center group-hover:border-blue-600/50">
              <UploadCloud className="w-8 h-8 text-blue-600 mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Click to upload multiple images
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF (Auto-compressed)</p>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
              multiple
              onChange={handleMultiImage}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((imgUrl, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group shadow-sm bg-white dark:bg-[#0f172a]">
              <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-transform hover:scale-110"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
