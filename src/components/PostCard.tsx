import React, { useState } from "react";

interface PostCardProps {
  author: string;
  content: string;
  images?: string[];
}

export default function PostCard({ author, content, images = [] }: PostCardProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const hasMultiple = images.length > 1;

  const handleNext = () => {
    setCurrentImg((prev) => (prev + 1) % images.length);
  };
  const handlePrev = () => {
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="font-semibold mb-2">{author}</div>
      <div className="mb-4">{content}</div>
      {images.length > 0 && (
        <div className="flex gap-2 mb-4 items-center justify-center relative">
          {hasMultiple && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 px-2 py-1 rounded-full shadow"
              onClick={handlePrev}
            >
              ←
            </button>
          )}
          <img
            src={images[currentImg]}
            alt="Post"
            className="w-96 h-[32rem] object-cover rounded"
          />
          {hasMultiple && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 px-2 py-1 rounded-full shadow"
              onClick={handleNext}
            >
              →
            </button>
          )}
        </div>
      )}
      <div className="flex gap-6 items-center">
        <button className="btn">Like</button>
        <button className="btn">Dislike</button>
        <button className="btn">Comments</button>
        <button className="btn">Share</button>
      </div>
    </div>
  );
}
