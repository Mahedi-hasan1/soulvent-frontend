"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "./PostCard";

import { API_BASE } from "../lib/api";
const LIMIT = 5;

type Post = {
  id: string;
  content: string;
  images?: string[];
  author: string;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const feedRef = useRef<HTMLDivElement | null>(null);

  // Redirect to /auth if not logged in
  React.useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      window.location.replace("/auth");
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/feed?limit=${LIMIT}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      
      if (data && Array.isArray(data.posts)) {
        const mappedPosts = data.posts.map((p: { id: string; content: string; image_urls?: string[]; user?: { username?: string } }) => ({
          id: p.id,
          content: p.content,
          images: p.image_urls,
          author: p.user?.username || "Anonymous",
        }));

        if (mappedPosts.length > 0) {
          setPosts((prev) => [...prev, ...mappedPosts]);
          // If we get less than LIMIT posts, assume no more posts available
          setHasMore(mappedPosts.length === LIMIT);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
    
    setLoading(false);
  }, [loading, hasMore]);

  // Initial load
  useEffect(() => {
    if (!initialLoaded) {
      fetchPosts();
      setInitialLoaded(true);
    }
  }, [fetchPosts, initialLoaded]);

  // Intersection Observer for detecting when last post is visible
  useEffect(() => {
    if (!hasMore || loading || !initialLoaded || posts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const lastPost = entries[0];
        if (lastPost.isIntersecting) {
          fetchPosts();
        }
      },
      {
        root: feedRef.current,
        rootMargin: '0px', // No buffer - trigger exactly when last post starts appearing
        threshold: 0.01 // Trigger when just 1% of the last post is visible (very beginning)
      }
    );

    // Get the last post element
    const feedElement = feedRef.current;
    if (feedElement) {
      const lastPostElement = feedElement.children[posts.length - 1];
      if (lastPostElement) {
        observer.observe(lastPostElement as Element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, initialLoaded, posts.length, fetchPosts]);

  return (
    <div ref={feedRef} className="space-y-6 h-[80vh] overflow-y-auto pr-2">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-muted-foreground">Loading more posts...</span>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center text-muted-foreground py-4">
          No more posts to show
        </div>
      )}
      
      {!loading && posts.length === 0 && !initialLoaded && (
        <div className="text-center text-muted-foreground py-8">
          Loading posts...
        </div>
      )}

      {!loading && posts.length === 0 && initialLoaded && (
        <div className="text-center text-muted-foreground py-8">
          No posts available
        </div>
      )}
    </div>
  );
}