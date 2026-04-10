import { Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RedirectIfAuth from "./components/RedirectIfAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentDashboard from "./pages/student/StudentDashboard";
import RewardsLayout from "./pages/student/modules/engagement-rewards/components/RewardsLayout";
import RewardsDashboard from "./pages/student/modules/engagement-rewards/RewardsDashboard";
import Wallet from "./pages/student/modules/engagement-rewards/Wallet";
import Game from "./pages/student/modules/engagement-rewards/Game";
import Leaderboard from "./pages/student/modules/engagement-rewards/Leaderboard";
import Companion from "./pages/student/modules/engagement-rewards/Companion";

import GameBoard from "./pages/student/modules/engagement-rewards/game/GameBoard";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />

      <Route
        path="/register"
        element={
          <RedirectIfAuth>
            <Register />
          </RedirectIfAuth>
        }
      />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/progress-tracking"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marketplace"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/peer-learning"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/kuppi"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/rewards"
        element={
          <ProtectedRoute role="student">
            <RewardsLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RewardsDashboard key={user?._id ?? "guest"} />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="game" element={<Game />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="companion" element={<Companion />} />
      </Route>

      <Route
        path="/student/game/play"
        element={
          <ProtectedRoute role="student">
            <GameBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/game/play/:attempt"
        element={
          <ProtectedRoute role="student">
            <GameBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/rewards/game/play"
        element={
          <ProtectedRoute role="student">
            <GameBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/rewards/game/play/:attempt"
        element={
          <ProtectedRoute role="student">
            <GameBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/dashboard"
        element={
          <ProtectedRoute role="tutor">
            <TutorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route 
        path="*" 
        element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist.</p>
            <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go to Home</a>
          </div>
        } 
      />
    </Routes>

  );
}
