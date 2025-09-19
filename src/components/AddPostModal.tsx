"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatFileSize, processImageSelection } from "@/lib/utils";
import { uploadToCloudinary, createPost } from "@/lib/api";

interface AddPostModalProps {
  open: boolean;
  onClose: () => void;
}


export default function AddPostModal({ open, onClose }: AddPostModalProps) {
  const [notification, setNotification] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const [showNotification, setShowNotification] = useState(false);
  
  // Separate useEffect for notification timing
  useEffect(() => {
    if (notification) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        // Clear notification after fade out
        setTimeout(() => setNotification(null), 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Helper to fully reset modal state
  const resetModal = () => {
    setText("");
    setImages([]);
    setIsCompressing(false);
    setIsUploading(false);
  };

  // Use the same token logic as Feed.tsx
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Use processImageSelection helper for image selection and compression
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processImageSelection(e, images, (imgs: File[]) => setImages(imgs), setIsCompressing);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Submit handler using imported API functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Upload all images to Cloudinary (images are already compressed)
      const imageUrls = await Promise.all(images.map(uploadToCloudinary));
      // Send post data to your API
      const response = await createPost(token, text, imageUrls);
      if (response.status === 201) {
        resetModal();
        onClose();
        setTimeout(() => {
          setNotification({ type: 'success', message: 'Post created successfully!' });
        }, 100);
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Post Creation Failed' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Notification - Always rendered outside modal condition */}
      {showNotification && notification && createPortal(
        <div
          className={`fixed bottom-8 right-8 z-[9999] px-6 py-3 rounded-lg shadow-xl text-lg font-semibold transition-all duration-300 transform ${
            showNotification ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>,
        document.body
      )}
      
      {/* Modal - Only rendered when open */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-12 w-full max-w-xl relative min-h-[420px] flex flex-col" style={{ maxHeight: '80vh' }}>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              style={{ lineHeight: 1 }}
              onClick={() => {
                resetModal();
                onClose();
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar">
              <textarea
                className="text-lg resize-none placeholder:text-gray-500 flex-grow min-h-[120px] border rounded-md focus:outline-none focus:border focus:border-black/50 bg-gray-100"
                placeholder="Write what is on your mind"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                style={{
                  color: '#222',
                  border: '1px solid rgba(0,0,0,0.5)',
                  minHeight: '120px',
                  maxHeight: '240px',
                  boxSizing: 'border-box',
                  padding: '1rem'
                }}
                ref={el => {
                  if (el) {
                    el.scrollTop = el.scrollHeight;
                  }
                }}
              />
              <div>
                  <label className="block font-semibold mb-2">Upload Images</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-1/2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 opacity-0 absolute inset-0 cursor-pointer"
                        style={{ height: "40px" }}
                        id="image-upload"
                        disabled={isCompressing || isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className="block w-full bg-gray-100 text-gray-700 rounded px-4 py-2 cursor-pointer border border-gray-300"
                        style={{ minHeight: "40px" }}
                      >
                        Choose files
                      </label>
                    </div>
                    <div className="w-1/2 text-left text-sm text-gray-500">
                      {images.length === 0
                        ? "No image chosen"
                        : `${images.length} image${images.length > 1 ? 's' : ''} chosen`}
                    </div>
                  </div>
                {isCompressing && (
                  <div className="mt-2 text-blue-600 text-sm flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Compressing images...
                  </div>
                )}
                {isUploading && (
                  <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    Uploading...
                  </div>
                )}
                {images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        <div className="flex flex-col">
                          <span className="text-xs">{img.name}</span>
                          <span className="text-xs text-green-600">
                            {formatFileSize(img.size)} ✓ Compressed
                          </span>
                        </div>
                        <button
                          type="button"
                          className="text-red-500 text-2xl ml-2"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                style={{ fontSize: '1.25rem' }}
                disabled={isCompressing || isUploading}
              >
                {isCompressing ? 'Compressing...' : isUploading ? 'Uploading...' : 'Post'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}