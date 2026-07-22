import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Dumbbell, Menu, LogOut, Home, Gem, TrendingUp, BookOpen, User } from "lucide-react";

export default function TrainerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const TRAINER_NAV_ITEMS = [
    { path: "/trainer", label: "Dashboard", icon: Home },
    { path: "/trainer/members", label: "My Members", icon: Gem },
    { path: "/trainer/assign-plan", label: "Assign Plan", icon: Dumbbell },
    { path: "/trainer/exercises", label: "Exercise Guide", icon: BookOpen },
    { path: "/trainer/progress", label: "Monitor Progress", icon: TrendingUp },
    { path: "/trainer/profile", label: "Settings & Profile", icon: User },
  ];

  const TRAINER_PAGE_TITLES = {
    "/trainer": "Dashboard",
    "/trainer/members": "My Members",
    "/trainer/assign-plan": "Assign Plan",
    "/trainer/exercises": "Exercise Guide",
    "/trainer/progress": "Monitor Progress",
    "/trainer/profile": "Account Settings",
  };

  const title = TRAINER_PAGE_TITLES[location.pathname] || "Dashboard";
  const user = JSON.parse(localStorage.getItem("fittrack_user") || '{"firstName":"Alex","lastName":"Vance","plan":"Senior Trainer"}');

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-overlay admin-overlay-visible" onClick={() => setSidebarOpen(false)} />}

      <aside className={`member-sidebar${sidebarOpen ? " member-sidebar-open" : ""}`}>
        <div className="member-sidebar-header">
          <button className="member-sidebar-brand" onClick={() => handleNav("/trainer")}>
            <Dumbbell size={20} /> FitTrack
          </button>
        </div>
        <nav className="member-sidebar-nav">
          {TRAINER_NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`member-nav-item${location.pathname === item.path ? " member-nav-item-active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="member-nav-icon"><item.icon size={18} /></span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="member-sidebar-footer">
          <button className="member-logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="member-main">
        <div className="member-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="member-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button>
            <h1 className="member-topbar-title">{title}</h1>
          </div>
          <div className="member-topbar-actions">
            <div className="member-user-card" onClick={() => handleNav("/trainer/profile")} style={{ cursor: "pointer" }}>
              <div className="member-avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
              <div className="member-user-info">
                <div className="member-user-name">{user.firstName} {user.lastName}</div>
                <div className="member-user-plan">{user.plan ?? "Trainer"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="member-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
