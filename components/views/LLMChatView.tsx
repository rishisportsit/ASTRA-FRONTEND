
import React, { useState, useRef } from 'react';
import { Sparkles, Send, Bot, History, Plus, MessageSquare, ChevronDown, Zap, Paperclip, X, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '@/hooks/useNotes';

type Model = 'gemini' | 'chatgpt';

interface ChatSession {
    id: string;
    title: string;
    date: string;
}

const MOCK_HISTORY: ChatSession[] = [
    { id: '1', title: 'Market Analysis Q3', date: 'Today' },
    { id: '2', title: 'Code Refactoring', date: 'Yesterday' },
    { id: '3', title: 'Email Draft to Client', date: 'Previous 7 Days' },
];

export const LLMChatView = () => {
    const [selectedModel, setSelectedModel] = useState<Model>('gemini');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [input, setInput] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Internal Notes Integration
    const { notes, loading: notesLoading } = useNotes();
    const [isNotesPickerOpen, setIsNotesPickerOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Simple validation for JSON (optional, but requested context implies JSON notes)
            // For now, allow any file, but maybe warn if not JSON? 
            // User asked "attach the notes as json", implies they have json files.
            setAttachment(file);
        }
    };

    const handleRemoveAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAttachNote = (note: any) => { // Using any for simplicity here, or import Note type
        const noteContent = JSON.stringify(note, null, 2);
        const file = new File([noteContent], `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`, { type: "application/json" });
        setAttachment(file);
        setIsNotesPickerOpen(false);
    };

    return (
        <div className="h-[calc(100vh-250px)] w-full flex gap-6">

            {/* Sidebar - History */}
            <div className="hidden md:flex w-64 flex-col gap-4">
                <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-2 text-white/80 hover:text-white transition-all font-medium active:scale-95 duration-200">
                    <Plus size={18} />
                    <span>New Chat</span>
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="space-y-2">
                        <div className="px-2 text-xs font-semibold text-white/30 uppercase tracking-wider">Recent</div>
                        {MOCK_HISTORY.map((chat) => (
                            <button key={chat.id} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors flex items-center gap-3 group">
                                <MessageSquare size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
                                <span className="truncate text-sm">{chat.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden flex flex-col relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                    <div className="relative">
                        <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-white transition-all"
                        >
                            <span className="flex items-center gap-2">
                                {selectedModel === 'gemini' ? (
                                    <>
                                        <Sparkles size={14} className="text-blue-400" />
                                        <span>Gemini 1.5 Pro</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={14} className="text-green-400" />
                                        <span>ChatGPT 4o</span>
                                    </>
                                )}
                            </span>
                            <ChevronDown size={14} className={`text-white/50 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isModelDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 ring-1 ring-white/10"
                                >
                                    <button
                                        onClick={() => { setSelectedModel('gemini'); setIsModelDropdownOpen(false); }}
                                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors"
                                    >
                                        <Sparkles size={16} className="text-blue-400" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">Gemini 1.5 Pro</span>
                                            <span className="text-[10px] text-white/40">Google DeepMind</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => { setSelectedModel('chatgpt'); setIsModelDropdownOpen(false); }}
                                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors border-t border-white/5"
                                    >
                                        <Zap size={16} className="text-green-400" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">ChatGPT 4o</span>
                                            <span className="text-[10px] text-white/40">OpenAI</span>
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/30 font-mono">
                            {selectedModel === 'gemini' ? '1M Context' : '128k Context'}
                        </div>
                    </div>
                </div>

                {/* Messages Placeholder */}
                <div className="flex-1 overflow-y-auto z-10 space-y-6 p-6 scroll-smooth custom-scrollbar">

                    {/* Welcome Message */}
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center rotate-3">
                            {selectedModel === 'gemini' ? (
                                <Sparkles size={32} className="text-blue-400" />
                            ) : (
                                <Zap size={32} className="text-green-400" />
                            )}
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-xl font-semibold text-white">
                                How can {selectedModel === 'gemini' ? 'Gemini' : 'ChatGPT'} help?
                            </h3>
                            <p className="text-sm text-white/50">
                                Ask for market analysis, trade summaries, or code assistance.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Input Area */}
                <div className="p-6 z-10 relative">
                    {/* Attachment Preview */}
                    <AnimatePresence>
                        {attachment && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-6 mb-2 flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-lg"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Paperclip size={14} className="text-white/60" />
                                </div>
                                <div className="flex flex-col max-w-[200px]">
                                    <span className="text-xs font-medium text-white truncate">{attachment.name}</span>
                                    <span className="text-[10px] text-white/40">{(attachment.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <button
                                    onClick={handleRemoveAttachment}
                                    className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors ml-2"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )}

                        {/* Notes Picker Popover */}
                        {isNotesPickerOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-6 mb-2 w-64 max-h-60 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden flex flex-col z-50"
                            >
                                <div className="px-3 py-2 border-b border-white/5 text-xs font-semibold text-white/50 uppercase">
                                    Select Internal Note
                                </div>
                                <div className="overflow-y-auto custom-scrollbar flex-1 p-1">
                                    {notesLoading ? (
                                        <div className="p-4 text-center text-xs text-white/30">Loading...</div>
                                    ) : notes.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-white/30">No notes found</div>
                                    ) : (
                                        notes.map(note => (
                                            <button
                                                key={note.id}
                                                onClick={() => handleAttachNote(note)}
                                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs truncate flex items-center gap-2"
                                            >
                                                <StickyNote size={12} className="flex-shrink-0 opacity-50" />
                                                <span className="truncate">{note.title}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

                        {/* File Input (Hidden) */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json,application/json" // Requesting JSON notes specifically
                            className="hidden"
                        />

                        <div className="relative w-full bg-[#0A0A0A]/80 border border-white/10 rounded-xl flex items-center overflow-hidden transition-all focus-within:border-white/20">
                            {/* Attachment Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="pl-3 pr-2 py-4 text-white/40 hover:text-white transition-colors"
                                title="Attach JSON file"
                            >
                                <Paperclip size={20} />
                            </button>

                            {/* Note Button */}
                            <button
                                onClick={() => setIsNotesPickerOpen(!isNotesPickerOpen)}
                                className="px-2 py-4 text-white/40 hover:text-white transition-colors"
                                title="Attach Internal Note"
                            >
                                <StickyNote size={20} />
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Message ${selectedModel === 'gemini' ? 'Gemini' : 'ChatGPT'}...`}
                                className="w-full bg-transparent border-none py-4 px-2 text-white placeholder-white/30 focus:outline-none focus:ring-0 font-medium"
                            />

                            <div className="pr-2">
                                <button
                                    className={`p-2 rounded-lg transition-all ${input.trim() || attachment
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 rotate-0 scale-100'
                                        : 'bg-white/5 text-white/30 rotate-90 scale-90'
                                        }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar justify-center">
                        {["Analyze EURUSD", "Draft Weekly Report", "Explain Market Sentiment"].map((suggestion) => (
                            <button key={suggestion} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-xs text-white/50 hover:text-white transition-colors whitespace-nowrap">
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
