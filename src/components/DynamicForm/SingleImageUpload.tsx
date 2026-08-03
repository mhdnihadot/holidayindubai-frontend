import React, { useState } from 'react';
import { Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { ImageCropperModal } from '@/components/ui/ImageCropperModal';
import { toast } from 'sonner';

const getRatioLabel = (ratio: number): string => {
  const r = Math.round(ratio * 1000) / 1000;
  if (r === Math.round((16 / 9) * 1000) / 1000) return '16:9';
  if (r === Math.round((4 / 3) * 1000) / 1000) return '4:3';
  if (r === 1) return '1:1';
  if (r === Math.round((3 / 2) * 1000) / 1000) return '3:2';
  if (r === Math.round((21 / 9) * 1000) / 1000) return '21:9';
  if (r === Math.round((16 / 10) * 1000) / 1000) return '16:10';
  return `${r.toFixed(2)}:1`;
};

interface SingleImageUploadProps {
  value: any;
  onChange: (val: any) => void;
  aspectRatio?: number;
  cropWidth?: number;
  cropHeight?: number;
  previewWidth?: string | number;
  previewHeight?: string | number;
}

export const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  value,
  onChange,
  aspectRatio,
  cropWidth,
  cropHeight,
  previewWidth,
  previewHeight,
}) => {
  const [rawImage, setRawImage] = useState('');
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof value === 'string') {
      setPreviewUrl(value);
    } else {
      setPreviewUrl('');
    }
  }, [value]);

  const resolvedAspectRatio = aspectRatio || (cropWidth && cropHeight ? cropWidth / cropHeight : 4 / 3);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PNG, JPG, WEBP, or AVIF.');
        e.target.value = '';
        return;
      }

      const MAX_SAFE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SAFE_SIZE) {
        toast.error('File is too large! Maximum allowed size is 10MB.');
        e.target.value = '';
        return;
      }

      setOriginalFileName(file.name);
      const url = URL.createObjectURL(file);
      setRawImage(url);
      setIsCropperOpen(true);
    }
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);
    const originalName = originalFileName || 'image.jpg';
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || 'image';
    const webpFileName = `${baseName}.webp`;
    
    const fileObject = new File([croppedBlob], webpFileName, { type: 'image/webp' });
    
    setIsUploading(true);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
        throw new Error('Cloudinary configuration missing in .env file.');
      }

      const formData = new FormData();
      formData.append('file', fileObject);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to upload image to Cloudinary');
      }
      const data = await res.json();
      onChange(data.secure_url);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Cloudinary upload failed:', error);
      toast.error(error.message || 'Failed to upload image. Please check Cloudinary config.');
    } finally {
      setIsUploading(false);
    }
  };

  const widthStyle = previewWidth !== undefined 
    ? (typeof previewWidth === 'number' ? `${previewWidth}px` : previewWidth) 
    : (cropWidth ? `${cropWidth}px` : undefined);
    
  const heightStyle = previewHeight !== undefined && previewHeight !== 'auto'
    ? (typeof previewHeight === 'number' ? `${previewHeight}px` : previewHeight) 
    : undefined;

  return (
    <div 
      className={`relative border-2 border-dashed border-border-subtle dark:border-gray-700 rounded-xl bg-[#f8fafc] dark:bg-[#0f172a]/50 hover:border-blue-600/50 transition-colors group overflow-hidden mt-2 ${heightStyle ? '' : 'min-h-[220px]'}`}
      style={{ 
        width: widthStyle || '100%', 
        height: heightStyle, 
        maxWidth: '100%',
        aspectRatio: heightStyle ? undefined : resolvedAspectRatio
      }}
    >
      {isUploading ? (
        <div className="absolute inset-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Uploading to Cloudinary...</p>
            <p className="text-xs text-gray-500 mt-0.5">Please wait while your banner is processed and hosted</p>
          </div>
        </div>
      ) : null}

      {value ? (
        <div className="relative w-full h-full overflow-hidden">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-center" />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange('');
            }}
            className="absolute top-3 right-3 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
            title="Remove Image"
          >
            <Trash2 size={16} />
          </button>

          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <UploadCloud className="w-8 h-8 text-white mb-2" />
            <span className="text-white font-medium text-sm">Change Image</span>
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
            onChange={handleImageChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 w-full h-full absolute inset-0">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-2">
            <UploadCloud className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5 text-center">
            Click to upload <span className="font-normal text-gray-500">or drag & drop</span>
          </p>
          <p className="text-[10px] text-gray-400 text-center">
            PNG, JPG, WEBP, or AVIF
          </p>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
            onChange={handleImageChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}

      {/* Hover Crop info overlay */}
      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-[10px] text-white px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col gap-0.5 z-20 border border-white/10 font-mono">
        <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Crop Info</span>
        <span>Ratio: <strong className="text-white">{getRatioLabel(resolvedAspectRatio)}</strong></span>
        {cropWidth && cropHeight && (
          <span>Target: <strong className="text-white">{cropWidth}×{cropHeight}px</strong></span>
        )}
      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={rawImage}
        onCropComplete={handleCropComplete}
        aspectRatio={resolvedAspectRatio}
        cropWidth={cropWidth}
        cropHeight={cropHeight}
      />
    </div>
  );
};
