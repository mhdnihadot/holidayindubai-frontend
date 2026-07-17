import axios from 'axios';
import apiClient from '../services/apiClient';

export type GetSignedUrlFolder = 
  | 'emirates' 
  | 'cities' 
  | 'projects' 
  | 'properties' 
  | 'blogs' 
  | 'developers' 
  | 'agent-id-proof' 
  | 'user-documents';

export interface SignedUrlResponse {
  success: boolean;
  data: {
    key: string;
    uploadURL: string;
  };
}

/**
 * Converts a Blob to a File object with a WebP extension and custom itemId name
 */
export const convertImage = (blob: Blob, format: 'image/webp', itemId: string): File => {
  const extension = format === 'image/webp' ? 'webp' : 'png';
  return new File([blob], `${itemId}.${extension}`, {
    type: format,
  });
};

/**
 * Gets a presigned S3 upload URL from the backend
 */
export const getSignedUrl = async (
  file: File,
  itemId: string,
  folderType: GetSignedUrlFolder
): Promise<SignedUrlResponse> => {
  const extension = file.name.split('.').pop();
  const filename = `${itemId}.${extension}`;

  const response = await apiClient.get<SignedUrlResponse>(`/uploads/get-signed-url/${itemId}`, {
    params: {
      filename,
      filetype: file.type,
      folder: folderType,
    },
  });

  return response.data;
};

/**
 * Uploads a binary file directly to S3 using the presigned URL
 */
export const uploadToS3 = async (file: File, url: string) => {
  try {
    const response = await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    return response;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

/**
 * Uploads one or more WebP images (or files) directly to S3 and returns the S3 keys
 */
export const uploadImageGroup = async (
  images: { webp: Blob } | { webp: Blob }[],
  itemId: string,
  folder: GetSignedUrlFolder
): Promise<{ webp: string } | { webp: string }[]> => {
  const isArray = Array.isArray(images);

  if (isArray) {
    return await Promise.all(
      (images as { webp: Blob }[]).map(async (img) => {
        const webpFile = convertImage(img.webp, 'image/webp', itemId);
        const webpRes = await getSignedUrl(webpFile, itemId, folder);
        await uploadToS3(webpFile, webpRes.data.uploadURL);
        return {
          webp: webpRes.data.key,
        };
      })
    );
  } else {
    const img = images as { webp: Blob };
    const webpFile = convertImage(img.webp, 'image/webp', itemId);
    const webpRes = await getSignedUrl(webpFile, itemId, folder);
    await uploadToS3(webpFile, webpRes.data.uploadURL);
    return {
      webp: webpRes.data.key,
    };
  }
};
