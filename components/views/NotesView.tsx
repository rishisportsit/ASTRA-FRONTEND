import React, { useState } from "react";
import { Plus, Clock, Share2 } from "lucide-react";
import { NoteDialog, Note } from "../NoteDialog";
import { AnimatePresence } from "framer-motion";

export const NotesView = () => {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: '1',
            title: 'Project Ideas',
            content: '<p>Some rough ideas for the new design system...</p>',
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2',
            title: 'Meeting Notes',
            content: '<p>Discussed the Q1 roadmap and marketing strategy.</p><ul><li>Launch in April</li><li>Focus on mobile</li></ul>',
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now() - 86400000
        }
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const handleCreateUpdateNote = (noteData: Partial<Note>) => {
        if (noteData.id) {
            // Update
            setNotes(prev => prev.map(n => n.id === noteData.id ? {
                ...n,
                ...noteData,
                updatedAt: Date.now()
            } as Note : n));
        } else {
            // Create
            const newNote: Note = {
                id: Math.random().toString(36).substr(2, 9),
                title: noteData.title || "Untitled",
                content: noteData.content || "",
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            setNotes(prev => [newNote, ...prev]);
        }
    };

    const handleOpenCreate = () => {
        setEditingNote(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (note: Note) => {
        setEditingNote(note);
        setIsDialogOpen(true);
    };

    const handleShare = (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        const url = `${window.location.origin}/notes/${note.id}`;
        navigator.clipboard.writeText(url);
        alert(`Link copied to clipboard: ${url}`);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white/90">Notes</h2>
                <button
                    onClick={handleOpenCreate}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5"
                >
                    <Plus size={20} className="text-white/80" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => handleOpenEdit(note)}
                        className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group flex flex-col h-64 relative overflow-hidden"
                    >
                        <h3 className="font-semibold text-lg text-white/90 mb-2 group-hover:text-blue-200 transition-colors line-clamp-1 pr-8">
                            {note.title}
                        </h3>

                        <button
                            onClick={(e) => handleShare(e, note)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/40 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
                            title="Share note"
                        >
                            <Share2 size={16} />
                        </button>

                        <div
                            className="text-sm text-white/60 line-clamp-6 prose prose-invert prose-sm"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />

                        <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-white/30 border-t border-white/5">
                            <Clock size={12} />
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
                    </div>
                ))}

                {/* Empty State */}
                {notes.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30">
                        <p>No notes yet</p>
                        <button onClick={handleOpenCreate} className="mt-4 text-blue-400 hover:underline">Create one</button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isDialogOpen && (
                    <NoteDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onSave={handleCreateUpdateNote}
                        initialNote={editingNote}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
