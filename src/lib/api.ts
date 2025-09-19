// src/lib/api.ts

// Change this value to switch between environments
//export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://soulvent-api.onrender.com";
let defaultBase = "https://soulvent-api.onrender.com";
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
	defaultBase = "https://soulvent-api.onrender.com";//may give here localhost url
}
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || defaultBase;

// Cloudinary and post creation API logic
export const CLOUDINARY_UPLOAD_PRESET = "SoulVent";
export const CLOUDINARY_CLOUD_NAME = "drux3gykz";
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (token: string | null, text: string, imageUrls: string[]) => {
  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: text,
      image_urls: imageUrls,
    }),
  });
  return response;
};
