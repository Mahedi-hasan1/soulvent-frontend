"use client";
import React from "react";

export default function Suggestions() {
  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top half: Suggestions */}
      <div className="flex-1 flex flex-col justify-start space-y-0.01">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-lg p-4 flex items-center justify-between"
          >
            <span>@suggested_user</span>
            <button className="text-blue-500 font-semibold hover:underline transition-all">
              Follow
            </button>
          </div>
        ))}
      </div>
      {/* Bottom half: Ads */}
      <div className="flex-1 flex flex-col justify-start gap-4">
        <hr className="border-t border-border mb-2" />
        <div className="bg-card rounded-lg p-4 text-center">Ad Space</div>
        {/* More ads can go here */}
      </div>
    </div>
  );
}
