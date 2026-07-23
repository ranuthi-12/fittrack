import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Dumbbell, Menu, LogOut, Home, Gem, Wallet, GraduationCap, BarChart3, User } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ADMIN_NAV_ITEMS = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/members", label: "Manage Members", icon: Gem },
    { path: "/admin/payments", label: "Payment Tracking", icon: Wallet },
    { path: "/admin/trainers", label: "Manage Trainers", icon: GraduationCap },
    { path: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
    { path: "/admin/profile", label: "Settings & Profile", icon: User },
  ];

  const ADMIN_PAGE_TITLES = {
    "/admin": "Dashboard",
    "/admin/members": "Manage Members",
    "/admin/payments": "Payment Tracking",
    "/admin/trainers": "Manage Trainers",
    "/admin/attendance": "Gym Attendance Scanner",
    "/admin/reports": "Reports & Analytics",
    "/admin/profile": "Account Settings",
  };

  const title = ADMIN_PAGE_TITLES[location.pathname] || "Dashboard";
  const user = JSON.parse(localStorage.getItem("fittrack_user") || '{"firstName":"Admin","lastName":"User","plan":"Administrator"}');

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-overlay admin-overlay-visible" onClick={() => setSidebarOpen(false)} />}

      <aside className={`member-sidebar${sidebarOpen ? " member-sidebar-open" : ""}`}>
        <div className="member-sidebar-header">
          <button className="member-sidebar-brand" onClick={() => handleNav("/admin")}>
            <Dumbbell size={20} /> FitTrack
          </button>
        </div>
        <nav className="member-sidebar-nav">
          {ADMIN_NAV_ITEMS.map((item) => (
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
            <div className="member-user-card" onClick={() => handleNav("/admin/profile")} style={{ cursor: "pointer" }}>
              <div className="member-avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
              <div className="member-user-info">
                <div className="member-user-name">{user.firstName} {user.lastName}</div>
                <div className="member-user-plan">{user.plan ?? "Administrator"}</div>
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
