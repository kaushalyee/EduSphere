import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const MOTIVATIONAL_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { quote: "Dream bigger. Do bigger.", author: "Unknown" },
  { quote: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { quote: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { quote: "Great things never come from comfort zones.", author: "Unknown" },
  { quote: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { quote: "Little things make big days.", author: "Unknown" },
  { quote: "It's going to be hard but hard does not mean impossible.", author: "Unknown" },
  { quote: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { quote: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
  { quote: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown" },
  { quote: "Stay focused and never give up.", author: "Unknown" },
  { quote: "Strive for progress not perfection.", author: "Unknown" },
  { quote: "You are stronger than you think.", author: "Unknown" },
  { quote: "Every day is a second chance.", author: "Unknown" },
  { quote: "Work hard in silence. Let success be your noise.", author: "Unknown" },
  { quote: "Be so good they can't ignore you.", author: "Steve Martin" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" }
];

const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};

export default function ChatbotOverlay({ onClose, setActiveTab }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [sessionRecommendations, setSessionRecommendations] = useState({});
  const [quizPerformance, setQuizPerformance] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [todayMood, setTodayMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodLoading, setMoodLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSessionNavigate = (session) => {
    if (setActiveTab) {
      setActiveTab('PeerLearning');
    }
    navigate('/student/peer-learning');
    onClose();
  };

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

  // Fetch today's mood and 7-day history on mount
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const [todayRes, historyRes] = await Promise.all([
          api.get('/mood/today'),
          api.get('/mood/history')
        ]);
        setTodayMood(todayRes.data.data);
        setMoodHistory(historyRes.data.data);
      } catch (err) {
        console.error('Mood fetch error:', err);
      }
    };
    fetchMoodData();
  }, []);

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
        const { conversationId, title, messages: newMsgs, recommendedSessions, academicTopic, quizPerformance: qp } = res.data.data;

        // Store recommended sessions if present
        if (recommendedSessions && recommendedSessions.length > 0) {
          setSessionRecommendations(prev => ({
            ...prev,
            [conversationId]: { sessions: recommendedSessions, topic: academicTopic }
          }));
        }
        if (qp) {
          setQuizPerformance(prev => ({ ...prev, [conversationId]: qp }));
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
        const { userMessage, aiMessage, recommendedSessions, academicTopic, quizPerformance: qp } = res.data.data;

        // Store recommended sessions if present
        if (recommendedSessions && recommendedSessions.length > 0) {
          setSessionRecommendations(prev => ({
            ...prev,
            [activeConversationId]: { sessions: recommendedSessions, topic: academicTopic }
          }));
        }
        if (qp) {
          setQuizPerformance(prev => ({ ...prev, [activeConversationId]: qp }));
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

  const DailyQuoteCard = () => {
    const quote = getDailyQuote();
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">✨</span>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Daily Inspiration
          </p>
        </div>
        <p className="text-sm font-medium text-gray-700 italic leading-relaxed">
          "{quote.quote}"
        </p>
        <p className="text-xs text-gray-500 mt-2 text-right font-semibold">
          — {quote.author}
        </p>
      </div>
    );
  };

  const MoodTrackerPanel = () => {
    const moodEmojis = ['😢', '😔', '😕', '😐', '🙂', '😊', '😀', '😄', '🤩', '🥳'];
    const moodLabels = ['Terrible', 'Very Bad', 'Bad', 'Okay', 'Fine', 'Good', 'Great', 'Very Good', 'Excellent', 'Amazing'];

    const handleMoodSubmit = async () => {
      if (!selectedMood) return;
      try {
        setMoodLoading(true);
        const res = await api.post('/mood', { mood: selectedMood, note: moodNote });
        setTodayMood(res.data.data);
        setMoodHistory(prev => [...prev, res.data.data]);
        setSelectedMood(null);
        setMoodNote('');
      } catch (err) {
        console.error('Mood log error:', err);
      } finally {
        setMoodLoading(false);
      }
    };

    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">How are you feeling today?</h3>
          {todayMood && (
            <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-1 rounded-full">
              ✓ Logged today
            </span>
          )}
        </div>

        {!todayMood ? (
          <>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMood(index + 1)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                    selectedMood === index + 1
                      ? 'bg-indigo-100 border-2 border-indigo-400 scale-110'
                      : 'hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-[9px] text-gray-500 mt-0.5">{index + 1}</span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-center text-xs font-semibold text-indigo-600 mb-2">
                {moodEmojis[selectedMood - 1]} {moodLabels[selectedMood - 1]}
              </p>
            )}
            <input
              type="text"
              placeholder="Add a note (optional)..."
              value={moodNote}
              onChange={e => setMoodNote(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs mb-2 focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={handleMoodSubmit}
              disabled={!selectedMood || moodLoading}
              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition"
            >
              {moodLoading ? 'Saving...' : 'Log Mood'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <span className="text-3xl">{moodEmojis[todayMood.mood - 1]}</span>
            <p className="text-xs text-gray-500 mt-1">{moodLabels[todayMood.mood - 1]} ({todayMood.mood}/10)</p>
            {todayMood.note && <p className="text-xs text-gray-400 mt-1 italic">"{todayMood.note}"</p>}
          </div>
        )}

        {moodHistory.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-600 mb-2">Last 7 Days</p>
            <div className="flex items-end gap-1 h-12">
              {moodHistory.slice(-7).map((entry, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      entry.mood >= 7 ? 'bg-green-400' :
                      entry.mood >= 5 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ height: `${(entry.mood / 10) * 48}px` }}
                    title={`${moodLabels[entry.mood - 1]} (${entry.mood}/10)`}
                  />
                  <span className="text-[8px] text-gray-400">
                    {new Date(entry.date).toLocaleDateString('en', { weekday: 'narrow' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const QuizPerformanceCard = ({ performance, category }) => (
    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-2xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
          📊 Your {category} Performance
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-2xl font-black text-amber-600">{performance.lastScore}%</p>
          <p className="text-xs text-gray-500">Last Score</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-amber-600">{performance.averageScore}%</p>
          <p className="text-xs text-gray-500">Average</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-amber-600">{performance.attempts}</p>
          <p className="text-xs text-gray-500">Attempts</p>
        </div>
      </div>
      <div className="mt-2">
        <div className="w-full bg-amber-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${performance.lastScore >= 70 ? 'bg-green-500' : performance.lastScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${performance.lastScore}%` }}
          />
        </div>
      </div>
    </div>
  );

  const SessionCards = ({ sessions, topic, onNavigate }) => (
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
        <div
          key={session._id}
          onClick={() => onNavigate(session)}
          className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {session.topic}
              </p>
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
            </div>
            <div className="flex-shrink-0 mt-1">
              <span className="text-xs text-indigo-500 font-semibold group-hover:text-indigo-700">
                View →
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-indigo-100">
            <p className="text-xs text-indigo-500 font-medium">
              👆 Click to view this session in Peer Learning
            </p>
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
            <div className="flex flex-col max-w-lg mx-auto w-full pt-4">
              <MoodTrackerPanel />
              <DailyQuoteCard />
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">How can I help you?</h2>
              </div>
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
                          {!isUser && quizPerformance[activeConversationId] &&
                            messages[messages.length - 1]?._id === msg._id && (
                            <QuizPerformanceCard
                              performance={quizPerformance[activeConversationId]}
                              category={sessionRecommendations[activeConversationId]?.topic}
                            />
                          )}
                          {!isUser && sessionRecommendations[activeConversationId] &&
                            messages[messages.length - 1]?._id === msg._id && (
                             <SessionCards
                               sessions={sessionRecommendations[activeConversationId].sessions}
                               topic={sessionRecommendations[activeConversationId].topic}
                               onNavigate={handleSessionNavigate}
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
