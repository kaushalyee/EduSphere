import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotOverlay from "./components/ChatbotOverlay";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Award 
} from "lucide-react";

export default function StudentLayout() {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth();

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5 text-black" />,
      path: "/student/dashboard"
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5 text-black" />,
      path: "/student/peer-learning"
    },
    {
      id: "Market",
      title: "Market Place",
      icon: <ShoppingBag className="w-5 h-5 text-black" />,
      path: "/student/marketplace"
    },
    {
      id: "Progress",
      title: "Progress Tracking",
      icon: <TrendingUp className="w-5 h-5 text-black" />,
      path: "/student/progress-tracking"
    },
    {
      id: "Rewards",
      title: "Rewards & Game",
      icon: <Award className="w-5 h-5 text-black" />,
      path: "/student/rewards"
    },
  ];

  const getActiveTab = (path) => {
    const found = options.find(opt => path.includes(opt.path));
    return found ? found.id : "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab(pathname));
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setActiveTab(getActiveTab(pathname));
  }, [pathname]);

  const handleLogout = () => {
    // handled in sidebar
  };

  const isRewards = pathname.includes("/rewards");

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        options={options}
      />

      <div className="main-content flex-1 min-w-0 flex flex-col overflow-y-auto">
        {!isRewards && (
          <StudentHeader
            activeTab={activeTab}
            options={options}
            handleLogout={handleLogout}
          />
        )}

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {!isRewards && (
        <>
          <ChatbotButton isOpen={isChatOpen} toggleChat={() => setIsChatOpen(!isChatOpen)} />
          {isChatOpen && <ChatbotOverlay onClose={() => setIsChatOpen(false)} />}
        </>
      )}
    </div>
  );
}
