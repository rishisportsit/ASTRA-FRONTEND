import React from "react";
import { Plus, CheckCircle2, Circle } from "lucide-react";

export const TasksView = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white/90">Tasks</h2>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
                    <Plus size={20} className="text-white/80" />
                </button>
            </div>

            <div className="space-y-2">
                {/* Placeholder Tasks */}
                {[
                    { text: "Review pull requests", done: true },
                    { text: "Update documentation", done: false },
                    { text: "Design new landing page", done: false },
                    { text: "Fix navigation bug", done: false },
                ].map((task, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <button className="text-white/50 hover:text-white transition-colors">
                            {task.done ? (
                                <CheckCircle2 size={20} className="text-green-400" />
                            ) : (
                                <Circle size={20} />
                            )}
                        </button>
                        <span
                            className={`flex-1 text-sm ${task.done ? "text-white/30 line-through" : "text-white/80"
                                }`}
                        >
                            {task.text}
                        </span>
                        <div className="w-1 h-full rounded-full bg-white/0 group-hover:bg-white/20 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};
