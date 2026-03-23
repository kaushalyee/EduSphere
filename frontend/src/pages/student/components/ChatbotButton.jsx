import React from "react";
import { MessageSquare } from "lucide-react";

export default function ChatbotButton() {
  return (
    <button
      className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition"
      onClick={() => console.log("Chatbot Open")}
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
}