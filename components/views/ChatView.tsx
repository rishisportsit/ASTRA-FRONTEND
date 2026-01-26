import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageCircle, MoreVertical, LogOut } from "lucide-react";
import {
  sendMessage,
  subscribeToMessages,
  ChatMessage,
} from "@/utils/chat-service";

export const ChatView = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize - Check LocalStorage
  useEffect(() => {
    const storedName = localStorage.getItem("astra_chat_username");
    if (storedName) {
      setUsername(storedName);
    }
    setIsLoading(false);
  }, []);

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, username]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem(
      "username",
    ) as HTMLInputElement;
    if (input.value.trim()) {
      localStorage.setItem("astra_chat_username", input.value.trim());
      setUsername(input.value.trim());
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !username) return;

    const text = inputText;
    setInputText(""); // Optimistic clear

    try {
      await sendMessage(text, username);
    } catch (error) {
      console.error("Failed to send", error);
      setInputText(text); // Restore on error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("astra_chat_username");
    setUsername(null);
  };

  if (isLoading) return null;

  if (!username) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <MessageCircle size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Join the Chat</h2>
          <p className="text-white/50 text-center mb-8">
            Enter your name to start messaging.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="username"
              type="text"
              placeholder="Your Name"
              autoFocus
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium"
            />
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              Join Now
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/5">
      {/* Header */}
      <div className="flex-none h-16 px-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-bold text-xs ring-2 ring-white/10">
            #
          </div>
          <div>
            <h3 className="font-bold text-sm">Global Chat</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-white/50">
                {messages.length} messages
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2">
            <User size={12} className="text-white/50" />
            <span className="text-xs font-medium text-white/80">
              {username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth"
      >
        <div className="space-y-6 pt-4">
          {/* Welcome Message */}
          <div className="flex justify-center">
            <div className="bg-white/5 px-4 py-2 rounded-full text-xs text-white/40 border border-white/5">
              Welcome to the start of the chat
            </div>
          </div>

          {messages.map((msg, index) => {
            const isMe = msg.sender === username;
            const isSystem = msg.type === "system";
            const showAvatar =
              index === 0 || messages[index - 1].sender !== msg.sender;

            if (isSystem) return null;

            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ring-white/10 ${isMe ? "bg-blue-500 text-white" : "bg-white/10 text-white/70"} ${!showAvatar && "opacity-0"}`}
                >
                  {msg.sender[0].toUpperCase()}
                </div>

                <div
                  className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
                >
                  {showAvatar && !isMe && (
                    <span className="text-[10px] text-white/40 ml-1 mb-1">
                      {msg.sender}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20"
                        : "bg-white/10 text-white/90 rounded-tl-sm border border-white/5"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-white/5 border-t border-white/5">
        <form
          onSubmit={handleSend}
          className="relative flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black/20 border border-white/5 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:bg-black/30 focus:border-white/10 transition-all placeholder:text-white/20"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 p-2 rounded-xl bg-blue-500 text-white disabled:opacity-0 disabled:scale-75 transition-all hover:bg-blue-400 active:scale-90 shadow-lg shadow-blue-500/20"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
