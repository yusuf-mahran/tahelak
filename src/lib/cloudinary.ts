export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_id: string;
  original_filename: string;
}

export interface CloudinaryUploadError {
  message: string;
  status?: number;
}

/**
 * Upload an image file to Cloudinary
 * @param file - The image file to upload
 * @returns Promise with the upload response
 */
export async function uploadImageToCloudinary(
  file: File,
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary cloud name or upload preset is not defined');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Validate file size (3MB)
  const maxSize = 3 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size must be less than 3MB');
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('resource_type', 'image'); // Images are uploaded as 'image' resource type

  // Upload to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Upload failed with status ${response.status}`,
    );
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data;
}
