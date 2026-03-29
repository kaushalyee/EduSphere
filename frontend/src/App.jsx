import { Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RedirectIfAuth from "./components/RedirectIfAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentDashboard from "./pages/student/StudentDashboard";
import Rewards from "./pages/student/modules/engagement-rewards/Rewards";
import Game from "./pages/student/modules/engagement-rewards/Game";
import Leaderboard from "./pages/student/modules/engagement-rewards/Leaderboard";
import Statistics from "./pages/student/modules/engagement-rewards/Statistics";
import Wallet from "./pages/student/modules/engagement-rewards/Wallet";
import Companion from "./pages/student/modules/engagement-rewards/Companion";
import GameBoard from "./pages/student/modules/engagement-rewards/game/GameBoard";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
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
        path="/tutor/dashboard"
        element={
          <ProtectedRoute role="tutor">
            <TutorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/rewards"
        element={
          <ProtectedRoute role="student">
            <Rewards />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/rewards/wallet"
        element={
          <ProtectedRoute role="student">
            <Wallet />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/rewards/leaderboard"
        element={
          <ProtectedRoute role="student">
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/rewards/game"
        element={
          <ProtectedRoute role="student">
            <Game />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/rewards/statistics"
        element={
          <ProtectedRoute role="student">
            <Statistics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/companion"
        element={
          <ProtectedRoute role="student">
            <Companion />
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
      <Route
        path="/student/game"
        element={
          <ProtectedRoute role="student">
            <Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/game/play"
        element={
          <ProtectedRoute role="student">
            <GameBoard />
          </ProtectedRoute>
        }
      />
    </Routes>

  );
}
