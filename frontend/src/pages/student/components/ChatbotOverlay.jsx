import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  Plus, 
  Trash2, 
  Bot, 
  User, 
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Heart,
  Target,
  ChevronLeft
} from "lucide-react";

export default function ChatbotOverlay({ onClose }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isTyping]);

  // Initial Position: Bottom Right
  useEffect(() => {
    const margin = 20;
    const width = window.innerWidth < 640 ? window.innerWidth : 850;
    const height = window.innerWidth < 640 ? window.innerHeight : 650;
    
    setPosition({
      x: window.innerWidth - width - margin,
      y: window.innerHeight - height - margin
    });
  }, []);

  // Draggable logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      const width = 850;
      const height = 650;
      
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      // Viewport bounds
      newX = Math.max(0, Math.min(window.innerWidth - width, newX));
      newY = Math.max(0, Math.min(window.innerHeight - height, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    // Only drag if clicking the header
    if (e.target.closest('.drag-handle')) {
      isDragging.current = true;
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const startNewChat = (initialMessage = null) => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      title: initialMessage ? initialMessage.substring(0, 30) : "New Conversation",
      messages: [],
      createdAt: new Date()
    };
    
    setConversations([newChat, ...conversations]);
    setActiveConversationId(newId);

    if (initialMessage) {
      setTimeout(() => addMessage(newId, initialMessage, "user"), 100);
    }
  };

  const addMessage = (conversationId, content, role) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, {
          id: Date.now(),
          role,
          content,
          timestamp: new Date()
        }];
        
        let newTitle = conv.title;
        if (role === "user" && conv.messages.length === 0) {
          newTitle = content.substring(0, 30) + (content.length > 30 ? "..." : "");
        }

        return { ...conv, messages: updatedMessages, title: newTitle };
      }
      return conv;
    }));

    if (role === "user") {
      simulateAIResponse(conversationId);
    }
  };

  const simulateAIResponse = (conversationId) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage(conversationId, "I'm currently being set up. Please check back soon!", "assistant");
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    let targetId = activeConversationId;
    if (!targetId) {
      targetId = Date.now();
      const newChat = {
        id: targetId,
        title: input.substring(0, 30),
        messages: [],
        createdAt: new Date()
      };
      setConversations([newChat, ...conversations]);
      setActiveConversationId(targetId);
    }

    addMessage(targetId, input, "user");
    setInput("");
  };

  const deleteConversation = (e, id) => {
    e.stopPropagation();
    setConversations(conversations.filter(c => c.id !== id));
    if (activeConversationId === id) setActiveConversationId(null);
  };

  const suggestions = [
    { text: "Help me understand a topic", icon: <BookOpen className="w-5 h-5 text-blue-500" /> },
    { text: "Review my study plan", icon: <Calendar className="w-5 h-5 text-purple-500" /> },
    { text: "I'm feeling stressed", icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { text: "Prepare for my exam", icon: <Target className="w-5 h-5 text-amber-500" /> }
  ];

  return (
    <div 
      onMouseDown={handleMouseDown}
      className={`fixed sm:inset-auto w-full sm:w-[850px] sm:max-h-[calc(100vh-40px)] bg-white shadow-2xl rounded-none sm:rounded-[2rem] flex overflow-hidden z-[100] border border-gray-200 animate-in slide-in-from-bottom-8 duration-500`}
      style={{ 
        left: window.innerWidth < 640 ? 0 : position.x, 
        top: window.innerWidth < 640 ? 0 : position.y,
        height: window.innerWidth < 640 ? '100%' : '650px'
      }}
    >
      
      {/* Left Panel: Sidebar */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full hidden md:flex">
        <div className="p-6">
           <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-md shadow-indigo-200">
               <Bot className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="text-gray-800 font-black leading-none">EduSphere</h3>
               <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest mt-1">Assistant</p>
             </div>
           </div>

           <button 
             onClick={() => startNewChat()}
             className="w-full py-3.5 px-4 bg-white border border-gray-200 hover:border-indigo-500 text-gray-800 shadow-sm rounded-2xl flex items-center gap-3 transition-all group"
           >
             <Plus className="w-5 h-5 text-indigo-600 group-hover:rotate-90 transition-transform" />
             <span className="font-bold text-sm">New Chat</span>
           </button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 thin-scrollbar">
          {conversations.length === 0 && (
            <p className="text-gray-400 text-xs font-medium px-4 text-center mt-4 italic">No recent chats</p>
          )}
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all group ${activeConversationId === conv.id ? 'bg-white border-gray-200 shadow-sm ring-1 ring-indigo-500/10' : 'hover:bg-white border border-transparent'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeConversationId === conv.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-bold truncate ${activeConversationId === conv.id ? 'text-gray-900' : 'text-gray-500'}`}>
                  {conv.title}
                </span>
              </div>
              <button 
                onClick={(e) => deleteConversation(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-gray-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="p-6 border-t border-gray-200 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl text-gray-500 text-xs font-bold border border-gray-100 shadow-sm cursor-default">
            <span>📚</span> Academic Support
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl text-gray-500 text-xs font-bold border border-gray-100 shadow-sm cursor-default">
            <span>💙</span> Mental Wellbeing
          </div>
        </div>
      </div>

      {/* Right Panel: Active Chat */}
      <div className="flex-1 flex flex-col bg-white h-full relative overflow-hidden">
        {/* Header - Drag Handle */}
        <div className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 drag-handle cursor-move select-none">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-gray-800 font-black text-sm">EduSphere Assistant</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth thin-scrollbar bg-white">
          {!activeConversation ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center rotate-12 mb-8 animate-bounce shadow-2xl shadow-indigo-100">
                <Sparkles className="w-10 h-10 text-white -rotate-12" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">How can I help you?</h2>
              <p className="text-gray-500 font-medium mb-12">I'm here to assist with your studies, manage your schedule, or chat about your wellbeing.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => startNewChat(s.text)}
                    className="p-5 bg-white border border-gray-100 hover:border-indigo-500/30 hover:shadow-md rounded-3xl text-left transition-all group shadow-sm"
                  >
                    <div className="mb-3">{s.icon}</div>
                    <p className="text-gray-700 text-sm font-bold group-hover:text-indigo-600 transition-colors">{s.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {activeConversation.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                >
                  <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-700" />}
                    </div>
                    <div>
                      <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-primary-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 mt-2 block px-1 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="p-4 bg-gray-100 text-gray-400 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-gray-50/80 backdrop-blur-md border-t border-gray-100">
          <div className="relative group max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Ask me anything about studies or wellbeing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white border border-gray-200 text-gray-800 pl-6 pr-16 py-4 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all font-medium placeholder:text-gray-400"
            />
            <button 
              onClick={handleSend}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4">Educational Assistant Preview</p>
        </div>
      </div>

      <style jsx>{`
        .thin-scrollbar::-webkit-scrollbar { width: 5px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
}
