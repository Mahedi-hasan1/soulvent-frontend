"use client";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function Feed() {
  const demoPosts = [
    {
      id: "1",
      author: "Anonymous1",
      content: "This is a demo post #1. Soulvent is awesome!",
      images: ["/globe.svg"], // single image, no arrow
    },
    {
      id: "2",
      author: "Anonymous2",
      content: "Express yourself freely! #Soulvent",
      images: [], // no image, no arrow
    },
    {
      id: "3",
      author: "Anonymous3",
      content: "No identity pressure here. Just vibes.",
      images: ["/vercel.svg", "/window.svg", "/file.svg", "/globe.svg", "/next.svg", "/vercel.svg"],
    },
    {
      id: "4",
      author: "Anonymous4",
      content: "Connect with your city anonymously.",
      images: ["/window.svg", "/file.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/window.svg"],
    },
    {
      id: "5",
      author: "Anonymous5",
      content: "Trending local thoughts! #Soulvent",
      images: ["/file.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/window.svg", "/file.svg"],
    },
  ];

  return (
    <div className="space-y-6">
      {demoPosts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
