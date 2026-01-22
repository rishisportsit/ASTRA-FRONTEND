import React, { useState } from "react";
import { Plus, GripVertical, CheckCircle2, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ColumnType = "Dock" | "In Progress" | "Finished" | "Parked";
const COLUMNS: ColumnType[] = ["Dock", "In Progress", "Finished", "Parked"];

interface Task {
    id: string;
    content: string;
    column: ColumnType;
    createdAt: number;
}

export const TasksView = () => {
    const [boardName, setBoardName] = useState("");
    const [isBoardCreated, setIsBoardCreated] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskContent, setActiveTaskContent] = useState("");
    const [isAddingTask, setIsAddingTask] = useState<ColumnType | null>(null);

    const handleCreateBoard = () => {
        if (boardName.trim()) {
            setIsBoardCreated(true);
        }
    };

    const handleAddTask = (column: ColumnType) => {
        if (activeTaskContent.trim()) {
            const newTask: Task = {
                id: Math.random().toString(36).substr(2, 9),
                content: activeTaskContent,
                column,
                createdAt: Date.now()
            };
            setTasks([...tasks, newTask]);
            setActiveTaskContent("");
        }
        setIsAddingTask(null);
    };

    // Simple move function for demonstration (Drag and Drop is complex to implement robustly in one shot without dnd-kit or react-beautiful-dnd, but we can do a simple click-to-move for reliability first, or simple drag)
    // Let's implement a simple "Move to next" or click based move for MVP stability, 
    // OR use Framer Motion reorder if they are in same list. Since they are different lists, 
    // fully robust DnD requires more state. Let's provide "Move" actions in the card for now to hit the "4 columns" requirement reliably.

    const moveTask = (taskId: string, targetColumn: ColumnType) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, column: targetColumn } : t));
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };


    if (!isBoardCreated) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <CheckCircle2 size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create New Board</h2>
                    <p className="text-white/50 mb-8 text-sm">Given your workflow a name to get started.</p>

                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                            placeholder="e.g. Project Phoenix"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-center"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                        />
                    </div>

                    <button
                        onClick={handleCreateBoard}
                        disabled={!boardName.trim()}
                        className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        Create Board
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 px-1">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{boardName}</h2>
                    <p className="text-white/40 text-xs mt-1">Kanban Board</p>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-black backdrop-blur-md flex items-center justify-center text-[10px] text-white/70">
                            U{i}
                        </div>
                    ))}
                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/50">
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex h-full gap-4 min-w-full pb-4">
                    {COLUMNS.map((column) => (
                        <div key={column} className="flex-none w-72 md:w-80 flex flex-col bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden h-full max-h-[600px]">
                            {/* Column Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <h3 className="font-semibold text-white/90 text-sm flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${column === 'Dock' ? 'bg-blue-400' :
                                        column === 'In Progress' ? 'bg-yellow-400' :
                                            column === 'Finished' ? 'bg-green-400' : 'bg-gray-400'
                                        }`} />
                                    {column}
                                </h3>
                                <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded text-[10px]">
                                    {tasks.filter(t => t.column === column).length}
                                </span>
                            </div>

                            {/* Tasks List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                <AnimatePresence>
                                    {tasks.filter(t => t.column === column).map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group relative"
                                        >
                                            <p className="text-sm text-white/80 mb-2">{task.content}</p>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                                <span className="text-[10px] text-white/30">
                                                    {new Date(task.createdAt).toLocaleDateString()}
                                                </span>

                                                {/* Simple Move Actions */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {column !== "Parked" && (
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="p-1 hover:bg-red-500/20 rounded text-white/50 hover:text-red-400"
                                                            title="Delete"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    )}

                                                    {/* Move Forward Button */}
                                                    {column !== "Parked" && column !== "Finished" && (
                                                        <button
                                                            onClick={() => {
                                                                const nextCol = COLUMNS[COLUMNS.indexOf(column) + 1];
                                                                moveTask(task.id, nextCol);
                                                            }}
                                                            className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white"
                                                            title="Move Next"
                                                        >
                                                            <ChevronRight size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Add Task Input */}
                            <div className="p-3 border-t border-white/5">
                                {isAddingTask === column ? (
                                    <div className="space-y-2">
                                        <textarea
                                            autoFocus
                                            value={activeTaskContent}
                                            onChange={(e) => setActiveTaskContent(e.target.value)}
                                            placeholder="What needs to be done?"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white placeholder:text-white/20 focus:outline-none resize-none"
                                            rows={2}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddTask(column);
                                                }
                                                if (e.key === 'Escape') setIsAddingTask(null);
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddTask(column)}
                                                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 rounded-lg transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => setIsAddingTask(null)}
                                                className="px-3 hover:bg-white/5 text-white/50 text-xs py-1.5 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsAddingTask(column);
                                            setActiveTaskContent("");
                                        }}
                                        className="w-full py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-xs hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={12} />
                                        Add Task
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
