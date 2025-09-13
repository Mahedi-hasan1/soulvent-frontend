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
        <hr className="border-t border-border mb-0.5" />
        <div className="text-xs text-center text-muted-foreground tracking-wider mt-0 mb-1">
          Ads Space
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl shadow-md p-4 flex flex-col items-center gap-2 border border-blue-200">
          <div className="text-xs uppercase tracking-widest text-blue-500 font-bold mb-1">
            Developed by
          </div>
          <div className="text-lg font-extrabold text-gray-800 mb-1">
            Mahedi Hasan
          </div>
          <div className="text-sm text-muted-foreground font-mono mb-2">
            mmhasan5365@gmail.com
          </div>
          <div className="flex gap-6 mt-2">
            {/* WhatsApp */}
            <a
              href="https://wa.me/8801863106702"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="hover:scale-110 transition-transform"
            >
              <svg
                width="28"
                height="28"
                fill="currentColor"
                className="text-green-500"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.48A12 12 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.01L0 24l6.18-1.62A11.97 11.97 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.7 0-3.37-.34-4.93-1.01l-.35-.15-3.67.96.98-3.58-.18-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.48.71.17 1.36.15 1.87.09.57-.07 1.75-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.25-.19-.53-.33z" />
              </svg>
            </a>
            {/* GitHub */}
            <a
              href="https://github.com/Mahedi-hasan1"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="hover:scale-110 transition-transform"
            >
              <svg
                width="28"
                height="28"
                fill="currentColor"
                className="text-gray-700"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mahedi-hasan1/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="hover:scale-110 transition-transform"
            >
              <svg
                width="28"
                height="28"
                fill="currentColor"
                className="text-blue-700"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
              </svg>
            </a>
          </div>
        </div>
        {/* More ads can go here */}
      </div>
    </div>
  );
}
