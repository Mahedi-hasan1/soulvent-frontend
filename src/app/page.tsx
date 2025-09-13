import React from "react";
import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import Suggestions from "../components/Suggestions";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Left Column */}
      <aside className="hidden lg:flex flex-col w-1/6 xl:w-1/6 2xl:w-1/6 px-4 py-6 border-r border-border h-screen sticky top-0">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-3xl font-bold">SoulVent</span>
          </div>
          <Navigation />
        </div>
      </aside>
      {/* Feed Column */}
      <section className="flex-1 w-full max-w-3xl mx-auto px-2 py-6 overflow-y-auto h-screen feed-scrollbar border-r border-border">
        <Feed />
      </section>
      {/* Right Column */}
      <aside className="hidden xl:flex flex-col w-1/4 px-4 py-6 h-screen sticky top-0">
        <Suggestions />
      </aside>
    </main>
  );
}
