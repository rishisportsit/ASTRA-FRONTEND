"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tabsConfig } from "../config/dashboard-tabs";
import { Palette, Lock } from "lucide-react";

interface DashboardProps {
  onLock: () => void;
}

export default function Dashboard({ onLock }: DashboardProps) {
  const [activeTabId, setActiveTabId] = useState(tabsConfig[0].id);
  const [bgColor, setBgColor] = useState("#000000"); // Default black background

  const activeTab =
    tabsConfig.find((tab) => tab.id === activeTabId) || tabsConfig[0];

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">
      <div
        className="fixed inset-0 z-0 transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto h-screen flex flex-col px-4 md:px-8">
        <header className="pt-8 pb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1> */}
            {/* Color Picker Trigger */}
            <div className="relative group">
              <label
                htmlFor="bg-picker"
                className="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/5 transition-all flex items-center justify-center"
              >
                <Palette size={16} className="text-white/70" />
              </label>
              <input
                type="color"
                id="bg-picker"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Change Theme
              </span>
            </div>
          </div>

          {/* Tab Bar - Desktop */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            {tabsConfig.map((tab) => {
              const isActive = activeTabId === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? "bg-white/10 text-white shadow-sm" : "text-white/60 hover:text-white"}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={onLock}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors group"
            title="Lock Screen"
          >
            <Lock
              size={18}
              className="text-white/80 group-hover:text-white transition-colors"
            />
          </button>
        </header>

        <div className="md:hidden pb-6">
          <div className="flex items-center justify-between bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
            {tabsConfig.map((tab) => {
              const isActive = activeTabId === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className="flex-1 relative py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-highlight"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={`relative z-10 ${isActive ? "text-white" : "text-white/50"}`}
                  />
                  <span
                    className={`relative z-10 text-[10px] font-medium ${isActive ? "text-white" : "text-white/50"}`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto pb-6 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab.component}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
