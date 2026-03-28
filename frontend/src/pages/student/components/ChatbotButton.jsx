import React from "react";
import { MessageSquare } from "lucide-react";

export default function ChatbotButton({ isOpen, toggleChat }) {
  if (isOpen) return null;

  return (
    <button
      className="fixed bottom-8 right-8 p-5 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-50 group overflow-hidden"
      onClick={toggleChat}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      <MessageSquare className="w-7 h-7 relative z-10" />
    </button>
  );
}