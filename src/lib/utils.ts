// Helper to process image selection and compression for AddPostModal
export async function processImageSelection(
  event: React.ChangeEvent<HTMLInputElement>,
  currentImages: File[],
  setImages: (images: File[]) => void,
  setIsCompressing: (val: boolean) => void
) {
  if (event.target.files) {
    let files = Array.from(event.target.files);
    // Limit total images to 5
    if (files.length + currentImages.length > 5) {
      files = files.slice(0, 5 - currentImages.length);
      alert('You can select up to 5 images.');
    }
    setIsCompressing(true);
    try {
      // Compress ALL images to be under 300KB
      const compressedImages = await Promise.all(
        files.map(file => compressImage(file, 300, 0.8))
      );
      setImages([...currentImages, ...compressedImages]);
    } catch {
      setImages([...currentImages, ...files]);
    } finally {
      setIsCompressing(false);
      event.target.value = '';
    }
  }
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Image compression utility function
export const compressImage = (
  file: File,
  maxSizeKB: number = 300,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const maxDimension = 1200;
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      const compress = (currentQuality: number) => {
        const outputFormat =
          file.type === "image/png" && hasTransparency(canvas)
            ? "image/png"
            : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            const sizeKB = blob.size / 1024;
            if (sizeKB <= maxSizeKB || currentQuality <= 0.05) {
              const compressedFile = new File([blob], file.name, {
                type: outputFormat,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              const nextQuality =
                currentQuality > 0.3
                  ? currentQuality - 0.15
                  : currentQuality - 0.05;
              compress(Math.max(0.05, nextQuality));
            }
          },
          outputFormat,
          currentQuality
        );
      };
      compress(quality);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to detect transparency in PNG
export const hasTransparency = (canvas: HTMLCanvasElement): boolean => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true;
    }
  }
  return false;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};
