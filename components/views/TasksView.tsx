import React, { useState, useEffect } from "react";
import { Plus, GripVertical, CheckCircle2, ChevronRight, X, Layout, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    createBoard,
    subscribeToBoards,
    addTask as firebaseAddTask,
    moveTask as firebaseMoveTask,
    deleteTask as firebaseDeleteTask,
    subscribeToTasks,
    Board,
    Task,
    ColumnType
} from "@/utils/kanban-service";

const COLUMNS: ColumnType[] = ["Dock", "In Progress", "Finished", "Parked"];

export const TasksView = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Board Creation State
    const [newBoardName, setNewBoardName] = useState("");
    const [isCreatingBoard, setIsCreatingBoard] = useState(false);

    // Task Creation State
    const [activeTaskContent, setActiveTaskContent] = useState("");
    const [isAddingTask, setIsAddingTask] = useState<ColumnType | null>(null);

    // Fetch Boards on Mount
    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = subscribeToBoards(
            (fetchedBoards) => {
                setBoards(fetchedBoards);
                setIsLoading(false);
                setError(null);
                // Auto-select first board if none selected & boards exist
                if (!selectedBoardId && fetchedBoards.length > 0) {
                    // setSelectedBoardId(fetchedBoards[0].id);
                }
            },
            (err) => {
                console.error("Failed to load boards:", err);
                setError("Unable to load boards. Please check your connection or configuration.");
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, [selectedBoardId]);

    // Subscribe to Tasks when Board Selected
    useEffect(() => {
        if (selectedBoardId) {
            const unsubscribe = subscribeToTasks(
                selectedBoardId,
                (fetchedTasks) => {
                    setTasks(fetchedTasks);
                },
                (err) => {
                    console.error("Failed to load tasks:", err);
                    // Don't blow up the whole UI, just maybe show a toast or local error? 
                    // reusing global error for simplicity for now, but usually task error shouldn't clear board list
                    // Let's Keep board selected but show alert.
                    // setError("Failed to sync tasks."); 
                }
            );
            return () => unsubscribe();
        } else {
            setTasks([]);
        }
    }, [selectedBoardId]);

    const handleCreateBoard = async () => {
        if (newBoardName.trim()) {
            try {
                setError(null);
                const boardId = await createBoard(newBoardName.trim());
                setSelectedBoardId(boardId);
                setNewBoardName("");
                setIsCreatingBoard(false);
            } catch (error) {
                console.error("Failed to create board", error);
                setError("Failed to create board. Please try again.");
            }
        }
    };

    const handleAddTask = async (column: ColumnType) => {
        if (activeTaskContent.trim() && selectedBoardId) {
            await firebaseAddTask(selectedBoardId, activeTaskContent.trim(), column);
            setActiveTaskContent("");
            setIsAddingTask(null);
        }
    };

    const moveTask = async (taskId: string, targetColumn: ColumnType) => {
        if (selectedBoardId) {
            await firebaseMoveTask(selectedBoardId, taskId, targetColumn);
        }
    };

    const deleteTask = async (taskId: string) => {
        if (selectedBoardId) {
            await firebaseDeleteTask(selectedBoardId, taskId);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full text-white/50">Loading boards...</div>;
    }

    // If no board selected, show list of boards or create new
    if (!selectedBoardId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 w-full max-w-2xl mx-auto p-4">

                {/* Global Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 backdrop-blur-md"
                        >
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                            <button onClick={() => setError(null)} className="ml-auto hover:text-white"><X size={16} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isCreatingBoard ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="w-full space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Your Boards</h2>
                            <button
                                onClick={() => setIsCreatingBoard(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-colors"
                            >
                                <Plus size={16} /> New Board
                            </button>
                        </div>

                        {boards.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
                                <Layout size={48} className="text-white/20 mx-auto mb-4" />
                                <p className="text-white/50">
                                    {error ? "Could not verify existing boards." : "No boards yet."} <br /> Create one to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {boards.map(board => (
                                    <button
                                        key={board.id}
                                        onClick={() => setSelectedBoardId(board.id)}
                                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                                    >
                                        <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-300 transition-colors">{board.name}</h3>
                                        <p className="text-xs text-white/40">
                                            Created {board.createdAt?.toDate ? board.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Plus size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Create New Board</h2>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                placeholder="e.g. Q1 Roadmap"
                                autoFocus
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-center"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCreatingBoard(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 font-semibold hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBoard}
                                disabled={!newBoardName.trim()}
                                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    }

    const activeBoard = boards.find(b => b.id === selectedBoardId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedBoardId(null)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <Layout size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{activeBoard?.name || "Loading..."}</h2>
                        <p className="text-white/40 text-xs mt-1">Kanban Board</p>
                    </div>
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
                                                    {/* Handle timestamp safely - it might be null initially or different type */}
                                                    {task.createdAt?.toDate ? task.createdAt.toDate().toLocaleDateString() : 'Just now'}
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
