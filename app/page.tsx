"use client";

import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import LockScreen from "../components/LockScreen";

export default function Home() {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        setIsLocked(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden">
      <LockScreen isLocked={isLocked} onUnlock={() => setIsLocked(false)} />
      <div
        className={
          isLocked
            ? "blur-sm scale-[0.98] opacity-50 transition-all duration-500 min-h-screen"
            : "transition-all duration-500 min-h-screen"
        }
      >
        <Dashboard onLock={() => setIsLocked(true)} />
      </div>
    </div>
  );
}
