"use client";
import React, { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";
import AdsSection from "./AdsSection";

export default function Suggestions() {
  const [user, setUser] = useState<{ username: string; city: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState<any[]>([]);
  const [following, setFollowing] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    async function fetchUserAndSuggestions() {
      if (typeof window === "undefined") { setLoading(false); return; }
      // Try localStorage first
      const userStr = localStorage.getItem("user");
      let token = localStorage.getItem("token");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed.username && parsed.city) {
            setUser({ username: parsed.username, city: parsed.city });
          }
        } catch (e) { console.error("Failed to parse user from localStorage", e); }
      }
      if (!token) { setLoading(false); return; }
      // Fetch user info if not in localStorage
      if (!userStr) {
        try {
          const res = await fetch(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0]?.username && data[0]?.city) {
              setUser({ username: data[0].username, city: data[0].city });
              localStorage.setItem("user", JSON.stringify({ username: data[0].username, city: data[0].city }));
            }
          }
        } catch (e) { console.error("Failed to fetch user from API", e); }
      }
      // Fetch suggested users
      try {
        const res = await fetch(`${API_BASE}/suggested-users?limit=4`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSuggested(Array.isArray(data) ? data : []);
        } else {
          setSuggested([]);
        }
      } catch (e) {
        setSuggested([]);
      }
      setLoading(false);
    }
    fetchUserAndSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/followers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.status === 201) {
        setFollowing((prev) => ({ ...prev, [userId]: true }));
      }
    } catch {}
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Username top right */}
      <div className="flex justify-end items-start w-full mb-2 min-h-[2.5rem]">
        {loading ? (
          <span className="text-base text-gray-400 italic">Loading...</span>
        ) : user ? (
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-blue-700">{user.username}</span>
            {user.city && <span className="text-xs text-gray-500 mt-0.5">{user.city}</span>}
          </div>
        ) : (
          <span className="text-base text-gray-400 italic">User</span>
        )}
      </div>
      {/* Suggestions scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="text-sm font-bold text-gray-700 mb-2 pl-1">Suggestions</div>
        {suggested.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-4">No suggestions</div>
        )}
        {suggested.map((s) => (
          <div
            key={s.id}
            className="bg-card rounded-lg p-4 flex items-center justify-start gap-2"
          >
            <span className="font-bold">@{s.username}</span>
            <button
              className={
                following[s.id]
                  ? "text-gray-500 font-semibold cursor-default"
                  : "text-blue-500 font-semibold hover:underline transition-all"
              }
              disabled={!!following[s.id]}
              onClick={() => handleFollow(s.id)}
            >
              {following[s.id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
      {/* Ads section fixed at bottom */}
      <div className="mt-2">
        <AdsSection />
      </div>
    </div>
  );
}
