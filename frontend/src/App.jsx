import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

import MemberLayout from "./components/MemberLayout.jsx";
import MemberHome from "./pages/member/MemberHome.jsx";
import Membership from "./pages/member/Membership.jsx";
import WorkoutPlan from "./pages/member/WorkoutPlan.jsx";
import Progress from "./pages/member/Progress.jsx";
import Notifications from "./pages/member/Notifications.jsx";

import TrainerLayout from "./components/TrainerLayout.jsx";
import TrainerDashboard from "./pages/trainer/TrainerDashboard.jsx";
import MyMembers from "./pages/trainer/MyMembers.jsx";
import AssignPlan from "./pages/trainer/AssignPlan.jsx";
import MonitorProgress from "./pages/trainer/MonitorProgress.jsx";

import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageMembers from "./pages/admin/ManageMembers.jsx";
import PaymentTracking from "./pages/admin/PaymentTracking.jsx";
import ManageTrainers from "./pages/admin/ManageTrainers.jsx";
import Reports from "./pages/admin/Reports.jsx";

import ProfileSettings from "./pages/ProfileSettings.jsx";
import ExerciseLibrary from "./pages/ExerciseLibrary.jsx";

import "./App.css";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member Panel */}
          <Route element={<ProtectedRoute allowedRoles={["MEMBER", "ADMIN"]} />}>
            <Route path="/member" element={<MemberLayout />}>
              <Route index element={<MemberHome />} />
              <Route path="membership" element={<Membership />} />
              <Route path="workout-plan" element={<WorkoutPlan />} />
              <Route path="exercises" element={<ExerciseLibrary />} />
              <Route path="progress" element={<Progress />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* Trainer Panel */}
          <Route element={<ProtectedRoute allowedRoles={["TRAINER", "ADMIN"]} />}>
            <Route path="/trainer" element={<TrainerLayout />}>
              <Route index element={<TrainerDashboard />} />
              <Route path="members" element={<MyMembers />} />
              <Route path="assign-plan" element={<AssignPlan />} />
              <Route path="exercises" element={<ExerciseLibrary />} />
              <Route path="progress" element={<MonitorProgress />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* Admin Panel */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="payments" element={<PaymentTracking />} />
              <Route path="trainers" element={<ManageTrainers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
