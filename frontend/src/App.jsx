import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from './pages/Register.jsx';

import MemberLayout from './components/MemberLayout';
import MemberHome from './pages/member/MemberHome';
import Membership from './pages/member/Membership';
import WorkoutPlan from './pages/member/WorkoutPlan';
import Progress from './pages/member/Progress';
import Notifications from './pages/member/Notifications';

import TrainerLayout from "./components/TrainerLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

import TrainerDashboard from "./pages/trainer/TrainerDashboard.jsx";
import MyMembers from "./pages/trainer/MyMembers.jsx";
import AssignPlan from "./pages/trainer/AssignPlan.jsx";
import MonitorProgress from "./pages/trainer/MonitorProgress.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageMembers from "./pages/admin/ManageMembers.jsx";
import PaymentTracking from "./pages/admin/PaymentTracking.jsx";
import ManageTrainers from "./pages/admin/ManageTrainers.jsx";
import Reports from "./pages/admin/Reports.jsx";

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<MemberHome />} />
            <Route path="membership" element={<Membership />} />
            <Route path="workout-plan" element={<WorkoutPlan />} />
            <Route path="progress" element={<Progress />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          
              {/* ---------- Trainer panel ---------- */}
          <Route path="/trainer" element={<TrainerLayout />}>
            <Route index element={<TrainerDashboard />} />
            <Route path="members" element={<MyMembers />} />
            <Route path="assign-plan" element={<AssignPlan />} />
            <Route path="progress" element={<MonitorProgress />} />
          </Route>
    
          {/* ---------- Admin panel ---------- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<ManageMembers />} />
            <Route path="payments" element={<PaymentTracking />} />
            <Route path="trainers" element={<ManageTrainers />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
