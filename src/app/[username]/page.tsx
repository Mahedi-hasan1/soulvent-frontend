"use client";
import React from "react";
import Navigation from "../../components/Navigation";
import Suggestions from "../../components/Suggestions";
import ProfileClient from "../../components/ProfileClient";

type Props = {
  params: Promise<{ username: string }>;
};

export default function ProfilePage({ params }: Props) {
  const [navOpen, setNavOpen] = React.useState(false);
  const [username, setUsername] = React.useState<string>("");

  // Resolve the params promise
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setUsername(resolvedParams.username);
    });
  }, [params]);

  return (
    <>
      {/* Top bar for mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-background border-b border-border sticky top-0 z-20">
        <button
          className="p-2 rounded hover:bg-gray-100 focus:outline-none"
          aria-label="Open navigation"
          onClick={() => setNavOpen(true)}
        >
          {/* Hamburger icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span className="text-xl font-bold text-blue-700 ml-2">SoulVent</span>
      </div>
      {/* Navigation drawer/modal for mobile */}
      {navOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-40 flex">
          <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col">
            <button className="self-end mb-4 p-2" aria-label="Close navigation" onClick={() => setNavOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <Navigation />
          </div>
          <div className="flex-1" onClick={() => setNavOpen(false)}></div>
        </div>
      )}
      <main className="flex min-h-screen bg-background text-foreground">
        {/* Left Column - Navigation */}
        <aside className="hidden lg:flex flex-col w-1/6 xl:w-1/6 2xl:w-1/6 px-4 py-6 border-r border-border h-screen sticky top-0">
          <div className="flex flex-col items-center gap-8">
            <div className="mb-8">
              <span className="text-3xl font-bold">SoulVent</span>
            </div>
            <Navigation />
          </div>
        </aside>

        {/* Profile Column */}
        <section className="flex-1 w-full max-w-3xl mx-auto px-2 py-6 overflow-y-auto h-screen feed-scrollbar border-r border-border">
          {username && <ProfileClient username={username} />}
        </section>

        {/* Right Column - Suggestions */}
        <aside className="hidden xl:flex flex-col w-1/4 px-4 py-6 h-screen sticky top-0">
          <Suggestions />
        </aside>
      </main>
    </>
  );
}