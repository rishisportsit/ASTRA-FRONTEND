"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Delete } from "lucide-react";

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export default function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      const correctPin = process.env.NEXT_PUBLIC_LOCK_PASSWORD;
      if (pin === correctPin) {
        onUnlock();
        setPin("");
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)", y: 0 }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)", y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-black/40"
        >
          {/* Subtle Noise Texture for premium feel */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

          <div className="flex flex-col items-center gap-10 relative z-10">
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="text-4xl font-light tracking-tight text-white mb-2 drop-shadow-2xl font-mono">
                ASTRA
              </h1>
              <div className="flex items-center gap-2 bg-white/10 px-5 py-1.5 rounded-full backdrop-blur-3xl border border-white/10 shadow-lg">
                <Lock size={14} className="text-white/70" />
                <span className="text-[10px] font-medium tracking-widest uppercase text-white/70">
                  System Locked
                </span>
              </div>
            </motion.div>

            {/* Pins dots */}
            <div className="flex gap-4 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border border-white/30 transition-all duration-300 ${pin.length > i
                      ? "bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-110"
                      : "bg-transparent scale-100"
                    }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-w-sm">
              {[
                { num: "1" }, { num: "2" }, { num: "3" },
                { num: "4" }, { num: "5" }, { num: "6" },
                { num: "7" }, { num: "8" }, { num: "9" },
              ].map(({ num }) => (
                <button
                  key={num}
                  onClick={() => handleNumClick(num)}
                  className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col items-center justify-center transition-all duration-200 active:scale-95 active:bg-white/20 group"
                >
                  <span className="text-3xl font-light text-white/90 group-hover:text-white transition-colors">
                    {num}
                  </span>
                </button>
              ))}

              <div /> {/* Empty slot */}

              <button
                onClick={() => handleNumClick("0")}
                className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col items-center justify-center transition-all duration-200 active:scale-95 active:bg-white/20 group"
              >
                <span className="text-3xl font-light text-white/90 group-hover:text-white transition-colors">0</span>
              </button>

              <div className="flex items-center justify-center">
                <button
                  onClick={handleBackspace}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all hover:bg-white/5 active:scale-95"
                >
                  <Delete size={28} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
