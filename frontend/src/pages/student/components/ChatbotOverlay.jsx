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
  ChevronLeft,
  Loader,
  PanelLeft,
  Menu
} from "lucide-react";
import api from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

export default function ChatbotOverlay({ onClose }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [sessionRecommendations, setSessionRecommendations] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
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
  }, [messages, isTyping]);

  useEffect(() => {
    console.log('Conversations state updated:', conversations);
  }, [conversations]);

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

  // 1. Load Conversations on Mount
  useEffect(() => {
    const fetchConversations = async () => {
      console.log('Token:', localStorage.getItem('token'));
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get('/chat');
        
        // Add debugging logs as requested
        console.log('Conversations loaded:', res?.data?.data);
        
        // Safely check properties to prevent TypeErrors (like null pointer) throwing to the catch block on successful requests
        if (res.data && res.data.success) {
          setConversations(res.data.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setConversations(res.data.data);
        } else if (Array.isArray(res.data)) {
          setConversations(res.data);
        }
      } catch (err) {
        console.error("Fetch conversations error:", err);
        // Only set error message for actual 5xx backend errors to prevent 'Sorry' UI on 404 (no chats)
        if (err.response && err.response.status >= 500) {
          setError("Sorry, something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // 2. Load Messages when Conversation is Clicked
  const handleConversationClick = async (convId) => {
    setActiveConversationId(convId);
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/chat/${convId}/messages`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Start New Conversation
  const startNewChat = async (initialMessage = null) => {
    if (!initialMessage) {
      setActiveConversationId(null);
      setMessages([]);
      return;
    }

    try {
      setIsTyping(true);
      setError(null);
      
      const res = await api.post('/chat/start', { message: initialMessage });
      if (res.data.success) {
        const { conversationId, title, messages: newMsgs, recommendedSessions, academicTopic } = res.data.data;
        
        // Store recommended sessions if present
        if (recommendedSessions && recommendedSessions.length > 0) {
          setSessionRecommendations(prev => ({
            ...prev,
            [conversationId]: { sessions: recommendedSessions, topic: academicTopic }
          }));
        }

        const newConv = {
          _id: conversationId,
          groupName: title,
          lastMessageAt: new Date().toISOString()
        };
        
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(conversationId);
        setMessages(newMsgs);
      }
    } catch (err) {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // 4. Send Message in Existing Conversation
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userInput = input;
    setInput("");

    if (!activeConversationId) {
      // Start a new chat if no active conversation
      startNewChat(userInput);
      return;
    }

    // Optimistic Update
    const optimisticMessage = {
      _id: Date.now().toString(),
      senderId: "temp-user-id", // anything not null indicates user message
      content: userInput,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      setIsTyping(true);
      setError(null);
      
      const res = await api.post(`/chat/${activeConversationId}/message`, { message: userInput });
      if (res.data.success) {
        const { userMessage, aiMessage, recommendedSessions, academicTopic } = res.data.data;
        
        // Store recommended sessions if present
        if (recommendedSessions && recommendedSessions.length > 0) {
          setSessionRecommendations(prev => ({
            ...prev,
            [activeConversationId]: { sessions: recommendedSessions, topic: academicTopic }
          }));
        }

        setMessages(prev => {
          const filtered = prev.filter(m => m._id !== optimisticMessage._id);
          return [...filtered, userMessage, aiMessage];
        });
        
        setConversations(prev => prev.map(c => 
          c._id === activeConversationId ? { ...c, lastMessageAt: aiMessage.createdAt || new Date().toISOString() } : c
        ));
      }
    } catch (err) {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // 5. Delete Conversation
  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      setError(null);
      const res = await api.delete(`/chat/${id}`);
      if (res.data.success) {
        setConversations(prev => prev.filter(c => c._id !== id));
        if (activeConversationId === id) {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      setError("Sorry, something went wrong. Please try again.");
    }
  };

  const suggestions = [
    { text: "Help me understand a topic", icon: <BookOpen className="w-5 h-5 text-blue-500" /> },
    { text: "Review my study plan", icon: <Calendar className="w-5 h-5 text-purple-500" /> },
    { text: "I'm feeling stressed", icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { text: "Prepare for my exam", icon: <Target className="w-5 h-5 text-amber-500" /> }
  ];

  const SessionCards = ({ sessions, topic }) => (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
          <BookOpen className="w-3 h-3 text-indigo-600" />
        </div>
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Recommended Kuppi Sessions for {topic}
        </p>
      </div>
      {sessions.map((session) => (
        <div key={session._id} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 hover:border-indigo-300 transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">{session.topic}</p>
              <p className="text-xs text-indigo-600 font-medium">{session.category}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  👤 {session.tutorId?.name || 'Tutor'}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  📅 {new Date(session.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  🕐 {session.time}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${session.mode === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {session.mode}
                </span>
              </div>
              {session.mode === 'online' && session.meetingLink && (
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-1 block">
                  🔗 Join Meeting
                </a>
              )}
              {session.mode === 'offline' && session.location && (
                <p className="text-xs text-gray-500 mt-1">📍 {session.location}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div 
      onMouseDown={handleMouseDown}
      className={`fixed sm:inset-auto w-full sm:w-[850px] sm:max-h-[calc(100vh-40px)] bg-white shadow-2xl rounded-none sm:rounded-[2rem] flex overflow-hidden z-[100] border border-gray-200 animate-in slide-in-from-bottom-8 duration-500`}
      style={{ 
        left: window.innerWidth < 640 ? 0 : position.x, 
        top: window.innerWidth < 640 ? 0 : position.y,
        height: window.innerWidth < 640 ? '100%' : '650px',
        isolation: 'isolate'
      }}
    >
      
      {/* Left Panel: Sidebar */}
      <div className={`bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-300 overflow-hidden ${showSidebar ? 'w-72' : 'w-0 border-r-0'}`}>
        <div className="p-6 min-w-[288px]">
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
          {isLoading && !activeConversationId && conversations.length === 0 ? (
            <div className="flex justify-center my-4"><Loader className="w-5 h-5 text-indigo-500 animate-spin" /></div>
          ) : conversations.length === 0 ? (
            <p className="text-gray-400 text-xs font-medium px-4 text-center mt-4 italic">No recent chats</p>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv._id}
                onClick={() => handleConversationClick(conv._id)}
                className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all group ${activeConversationId === conv._id ? 'bg-white border-gray-200 shadow-sm ring-1 ring-indigo-500/10' : 'hover:bg-white border border-transparent'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeConversationId === conv._id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold truncate ${activeConversationId === conv._id ? 'text-gray-900' : 'text-gray-500'}`}>
                    {conv.groupName === 'New Conversation' && conv.lastMessage
                      ? conv.lastMessage.content.substring(0, 25) + '...'
                      : (conv.groupName || "New Conversation")}
                  </span>
                </div>
                <button 
                  onClick={(e) => deleteConversation(e, conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-gray-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
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
        <div className="flex-none h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md drag-handle cursor-move select-none z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 text-gray-400 hover:text-indigo-600 rounded-xl transition-all"
              title="Toggle History"
            >
              <PanelLeft className={`w-6 h-6 ${showSidebar ? 'text-indigo-600' : ''}`} />
            </button>
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

        {/* Error Display */}
        {error && (
          <div className="mx-8 mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth thin-scrollbar bg-white">
          {!activeConversationId && messages.length === 0 && !isTyping ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">How can I help you?</h2>
            </div>
          ) : (
            <>
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center my-8"><Loader className="w-6 h-6 text-indigo-500 animate-spin" /></div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.senderId !== null;
                  return (
                    <div 
                      key={msg._id || Math.random().toString()} 
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                    >
                      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${isUser ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-700" />}
                        </div>
                        <div>
                          <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${isUser ? 'bg-gradient-to-br from-indigo-600 to-primary-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                            {isUser ? (
                               msg.content
                            ) : (
                               msg.content.split('\n\n').map((paragraph, idx) => (
                                 <p key={idx} className={idx > 0 ? "mt-3" : ""}>{paragraph}</p>
                               ))
                            )}
                          </div>
                          {!isUser && sessionRecommendations[activeConversationId] && 
                            messages[messages.length - 1]?._id === msg._id && (
                             <SessionCards
                               sessions={sessionRecommendations[activeConversationId].sessions}
                               topic={sessionRecommendations[activeConversationId].topic}
                             />
                          )}
                          <span className="text-[10px] font-bold text-gray-400 mt-2 block px-1 uppercase tracking-tighter">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
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
        <div className="flex-none p-8 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 z-10">
          <div className="relative group max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Ask me anything about studies or wellbeing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              className="w-full bg-white border border-gray-200 text-gray-800 pl-6 pr-16 py-4 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all font-medium placeholder:text-gray-400 disabled:opacity-70"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${input.trim() && !isTyping ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
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
