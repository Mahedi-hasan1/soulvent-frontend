import React, { useState } from "react";
import Image from "next/image";

interface PostCardProps {
  author: string;
  content: string;
  images?: string[];
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showAuthor?: boolean;
}

export default function PostCard({ author, content, images = [], editable = false, onEdit, onDelete, showAuthor = true }: PostCardProps) {
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
  {showAuthor && <div className="font-semibold mb-2">{author}</div>}
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
          <Image
            src={images[currentImg]}
            alt="Post"
            width={384}
            height={512}
            className="w-96 h-[32rem] object-cover rounded z-10"
            priority={currentImg === 0}
            unoptimized
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
      <div className="flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <button className="btn">Like</button>
          <button className="btn">Dislike</button>
          <button className="btn">Comments</button>
          <button className="btn">Share</button>
        </div>
        {editable && (
          <div className="flex gap-2">
            <button className="btn" onClick={onEdit} disabled={!onEdit}>Edit</button>
            <button className="btn" onClick={onDelete} disabled={!onDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
