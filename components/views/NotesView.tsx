import React from "react";
import { Plus } from "lucide-react";

export const NotesView = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white/90">Notes</h2>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
                    <Plus size={20} className="text-white/80" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Placeholder Notes */}
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <h3 className="font-semibold text-white/80 mb-2 group-hover:text-white transition-colors">
                            Project Idea {i}
                        </h3>
                        <p className="text-sm text-white/50 line-clamp-3">
                            This is a placeholder note to demonstrate the liquid glass UI style.
                            It fits perfectly with the rest of the application.
                        </p>
                        <div className="mt-4 text-xs text-white/30">Just now</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
