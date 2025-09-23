"use client";
import React, { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";
import PostCard from "./PostCard";

interface Props {
  username: string;
}

type UserData = {
  id?: string;
  username: string;
  city?: string;
  gender?: string;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
};

type Post = {
  id?: string;
  user_id?: string;
  user?: { id?: string; username?: string };
  created_at?: string;
  content?: string;
  image_urls?: string[];
  images?: string[];
  author?: string;
};

export default function ProfileClient({ username }: Props) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState(false);
  const [cityValue, setCityValue] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [savingCity, setSavingCity] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
  let foundUser: UserData | null = null;
      try {
        // Fetch users list and find by username (API returns array)
        const tok = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const userHeaders: Record<string, string> = {};
        if (tok) userHeaders.Authorization = `Bearer ${tok}`;
        const rUsers = await fetch(`${API_BASE}/users`, { headers: userHeaders });
        if (rUsers.ok) {
          const list = await rUsers.json();
          if (Array.isArray(list)) {
            const arr = list as unknown[];
            foundUser = (arr.find((u) => (u as UserData).username === username) as UserData) || null;
          }
          if (foundUser) {
            setUser(foundUser);
            setCityValue(foundUser.city || "");
          }
        }
      } catch (e) {
        console.error(e);
      }
      try {
        const tok = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {};
        if (tok) headers.Authorization = `Bearer ${tok}`;

        if (tok) {
          // Authenticated: fetch all posts then filter by user_id or username
          const p = await fetch(`${API_BASE}/posts`, { headers });
          if (p.ok) {
            const d = await p.json();
            let list: unknown[] = [];
            if (Array.isArray(d)) list = d as unknown[];
            else if (d && typeof d === 'object' && Array.isArray((d as Record<string, unknown>).posts)) list = (d as Record<string, unknown>).posts as unknown[];
            if (foundUser && foundUser.id) {
              setPosts(list.filter((x) => (x as Post).user_id === foundUser!.id) as Post[]);
            } else {
              // fallback: match by username field on post if available
              setPosts(list.filter((x) => ((x as Post).user_id && foundUser && (x as Post).user_id === foundUser.id) || ((x as Post).user && (x as Post).user!.username === username)) as Post[]);
            }
          }
        } else {
          // Unauthenticated fallback: try username query
          const p = await fetch(`${API_BASE}/posts?username=${encodeURIComponent(username)}&limit=50`);
          if (p.ok) {
            const d = await p.json();
            let list: unknown[] = [];
            if (Array.isArray(d)) list = d as unknown[];
            else if (d && typeof d === 'object' && Array.isArray((d as Record<string, unknown>).posts)) list = (d as Record<string, unknown>).posts as unknown[];
            setPosts(list as Post[]);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [username]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const currentUser = typeof window !== 'undefined' && localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user') || '{}') as { username?: string; id?: string }) : null;

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/followers`, {
        method: user.is_following ? 'DELETE' : 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      if (res.ok || res.status === 201 || res.status === 204) {
        setUser((u) => u ? { ...u, is_following: !u.is_following, followers_count: (u.followers_count||0) + (u.is_following ? -1 : 1) } : u);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveCity = async () => {
    if (!user) return;
    setSavingCity(true);
    try {
      const res = await fetch(`${API_BASE}/users/${encodeURIComponent(user.username)}`, {
        method: 'PATCH',
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityValue }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setEditingCity(false);
      } else {
        // optimistic local update
        setUser((u) => u ? { ...u, city: cityValue } : u);
        setEditingCity(false);
      }
    } catch (e) {
      console.error(e);
    }
    setSavingCity(false);
  };

  const handleDeletePost = async (postId: string) => {
    const tok = token;
    if (!tok) return;
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.ok || res.status === 204) {
        setPosts((p) => p.filter((x) => x.id !== postId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditPost = async (postId: string, newContent: string) => {
    const tok = token;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((p) => p.map((x) => (x.id === postId ? updated : x)));
      } else {
        setPosts((p) => p.map((x) => (x.id === postId ? { ...x, content: newContent } : x)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-blue-700 shrink-0">
            {user?.gender === 'female' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-2/3 h-2/3 block m-auto max-w-full max-h-full" fill="currentColor" aria-hidden>
                <path d="M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-1 12v3h2v-3h1v-2h-1v-1.2a4 4 0 1 0-2 0V14H8v2h3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-2/3 h-2/3 block m-auto max-w-full max-h-full" fill="currentColor" aria-hidden>
                <path d="M14 2h4v4l-1.5-1.5L12 9.94 10.06 8 16.5 1.5 15 3H11a6 6 0 1 0 0 12h1v-2h-1a4 4 0 1 1 0-8z" />
              </svg>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">{username}</h2>
              <div className="ml-auto">
                        {user && user.username !== (currentUser ? currentUser.username : null) && (
                            <button className="btn" onClick={handleFollowToggle}>{user?.is_following ? 'Following' : 'Follow'}</button>
                          )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div>Followers: {user?.followers_count ?? '-'}</div>
              <div>Following: {user?.following_count ?? '-'}</div>
            </div>
            <div className="mt-3">
              {editingCity ? (
                <div className="flex gap-2">
                  <input className="input" value={cityValue} onChange={(e) => setCityValue(e.target.value)} />
                  <button className="btn" onClick={saveCity} disabled={savingCity}>{savingCity ? 'Saving...' : 'Save'}</button>
                  <button className="btn" onClick={() => { setEditingCity(false); setCityValue(user?.city || ''); }}>Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-700">{user?.city || 'No city set'}</div>
                  {user && user.username === (typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').username : null) && (
                    <button className="btn" onClick={() => setEditingCity(true)}>Edit</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
  <div className="text-xl font-semibold text-center">Posts</div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">No posts yet</div>
        ) : (
          posts.map((p, idx) => {
            const key = p.id || p.created_at || idx;
            const images = p.image_urls || p.images || [];
            const author = p.user?.username || p.author || username;
            const currentUserName = currentUser ? currentUser.username : null;
            const currentUserId = currentUser ? currentUser.id : null;
            const isOwner = (currentUserName === username) || (user && currentUserId && user.id === currentUserId);
            const canManage = isOwner && !!p.id;
            return (
              <div key={key} className="relative">
                <PostCard
                  author={author}
                  content={p.content ?? ""}
                  images={images}
                  editable={!!isOwner}
                  showAuthor={false}
                  onEdit={() => {
                    if (!canManage) return;
                    const newContent = prompt('Edit post content', p.content ?? '');
                    if (newContent !== null && p.id) handleEditPost(p.id, newContent);
                  }}
                  onDelete={() => { if (canManage && p.id) handleDeletePost(p.id); }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
