import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Users,
  ShoppingBag,
  Award,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import StudentContent from "./components/StudentContent";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotOverlay from "./components/ChatbotOverlay";
import StudentProfile from "./modules/StudentProfile"; // ← add this import

// ── Verification gate components ─────────────────────────────────────────

const ResubmissionForm = ({ refreshUser }) => {
  const [documentType, setDocumentType] = useState('');
  const [studentIdPhoto, setStudentIdPhoto] = useState(null);
  const [supportingDocument, setSupportingDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!documentType || !studentIdPhoto || !supportingDocument) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('studentIdPhoto', studentIdPhoto);
      formData.append('supportingDocument', supportingDocument);

      await api.put('/auth/resubmit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Resubmission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-600 font-semibold">Documents resubmitted successfully!</p>
        <p className="text-green-500 text-sm mt-1">Please wait for admin review.</p>
      </div>
    );
  }

  return (
    <div className="text-left space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm"
        >
          <option value="">Select document type</option>
          <option value="exam_timetable">Exam Timetable</option>
          <option value="enrollment_letter">Student Enrollment Letter</option>
          <option value="course_registration">Course Registration Document</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Student ID Photo</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setStudentIdPhoto(e.target.files[0])}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Supporting Document</label>
        <p className="text-xs text-gray-400 mb-1">Must be issued within the last 6 months</p>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setSupportingDocument(e.target.files[0])}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Documents'}
      </button>
    </div>
  );
};

const PendingVerificationScreen = ({ logout }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">⏳</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Account Pending Verification</h1>
      <p className="text-gray-500 mb-2">Your documents are being reviewed by our admin team.</p>
      <p className="text-gray-500 mb-2">
        This usually takes <strong>24–48 hours</strong>.
      </p>
      <p className="text-gray-500 mb-8">
        You will receive an email once your account is verified.
      </p>
      <button
        onClick={logout}
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
      >
        Logout
      </button>
    </div>
  </div>
);

const RejectedScreen = ({ reason, logout, refreshUser }) => {
  const [showResubmit, setShowResubmit] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Verification Rejected</h1>
        <p className="text-gray-500 mb-4">Unfortunately your verification was rejected.</p>
        {reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-red-600 font-semibold text-sm">Reason:</p>
            <p className="text-red-700 text-sm mt-1">{reason}</p>
          </div>
        )}
        {!showResubmit ? (
          <button
            onClick={() => setShowResubmit(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition mb-3"
          >
            Resubmit Documents
          </button>
        ) : (
          <ResubmissionForm refreshUser={refreshUser} />
        )}
        <button
          onClick={logout}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const ResubmissionScreen = ({ note, logout, refreshUser }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🔄</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Resubmission Required</h1>
      <p className="text-gray-500 mb-4">Please upload new valid documents.</p>
      {note && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-orange-600 font-semibold text-sm">Admin Note:</p>
          <p className="text-orange-700 text-sm mt-1">{note}</p>
        </div>
      )}
      <ResubmissionForm refreshUser={refreshUser} />
      <button
        onClick={logout}
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition mt-3"
      >
        Logout
      </button>
    </div>
  </div>
);

// ── Main dashboard ────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { user, logout, refreshUser } = useAuth();

  const getInitialTab = (path) => {
    if (path.includes("progress-tracking")) return "Progress";
    if (path.includes("marketplace")) return "Market";
    if (path.includes("peer-learning") || path.includes("kuppi")) return "PeerLearning";
    return "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab(pathname));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // ← add this

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setShowProfile(false);
      window.history.replaceState({}, document.title);
    } else {
      setActiveTab(getInitialTab(pathname));
    }
  }, [location.state, pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  // When switching tabs, close profile
  const handleTabChange = (tab) => {
    setShowProfile(false);
    setActiveTab(tab);
  };

  // Verification gate — shown after all hooks so React rules are respected
  if (user?.role === 'student') {
    if (user?.verificationStatus === 'pending') {
      return <PendingVerificationScreen logout={logout} />;
    }
    if (user?.verificationStatus === 'rejected') {
      return <RejectedScreen reason={user?.rejectionReason} logout={logout} refreshUser={refreshUser} />;
    }
    if (user?.verificationStatus === 'resubmission_required') {
      return <ResubmissionScreen note={user?.resubmissionNote} logout={logout} refreshUser={refreshUser} />;
    }
  }

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5 text-black" />,
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5 text-black" />,
    },
    {
      id: "Market",
      title: "Student Marketplace",
      icon: <ShoppingBag className="w-5 h-5 text-black" />,
    },
    {
      id: "Progress",
      title: "Progress Tracking",
      icon: <TrendingUp className="w-5 h-5 text-black" />,
    },
    {
      id: "Rewards",
      title: "Rewards & Game",
      icon: <Award className="w-5 h-5 text-black" />,
    },
  ];

  return (
    <div className="p-0">
      <StudentContent activeTab={activeTab} options={options} setActiveTab={setActiveTab} />
    </div>
  );
}
