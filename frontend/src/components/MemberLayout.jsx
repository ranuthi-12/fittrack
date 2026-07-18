import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Dumbbell, Menu, LogOut, Gem, Home, TrendingUp, Bell,} from "lucide-react";

export default function MemberLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount] = useState(3); // TODO: fetch from GET /api/notifications/unread-count

  const MEMBER_NAV_ITEMS = [
  { path: "/member",                label: "Dashboard",   icon: Home  },
  { path: "/member/membership",     label: "Membership",  icon: Gem  },
  { path: "/member/workout-plan",   label: "Workouts",    icon: Dumbbell },
  { path: "/member/progress",       label: "Progress",    icon: TrendingUp  },
  { path: "/member/notifications",  label: "Notifications",icon: Bell, badge: true },
];

  const PAGE_TITLES = {
  "/member":               "Dashboard",
  "/member/membership":    "Membership",
  "/member/workout-plan":  "Workout Plan",
  "/member/progress":      "Progress",
  "/member/notifications": "Notifications",
};

  const title = PAGE_TITLES[location.pathname] || "Dashboard";
  // TODO: fetch user from localStorage or GET /api/auth/me
  const user = JSON.parse(localStorage.getItem("fittrack_user") || '{"firstName":"John","lastName":"Doe","plan":"Pro Member"}');

  const handleNav = (path) => { navigate(path); setSidebarOpen(false); };

  return (
    <div className="member-layout">
      {sidebarOpen && <div className="member-overlay member-overlay-visible" onClick={() => setSidebarOpen(false)} />}

      <aside className={`member-sidebar${sidebarOpen ? " member-sidebar-open" : ""}`}>
        <div className="member-sidebar-header">
          <button className="member-sidebar-brand" onClick={() => handleNav("/member")}>
            <Dumbbell size={20} /> FitTrack
          </button>
        </div>
        <nav className="member-sidebar-nav">
          {MEMBER_NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`member-nav-item${location.pathname === item.path ? " member-nav-item-active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="member-nav-icon"><item.icon size={18} /></span>
              {item.label}
              {item.badge && notifCount > 0 && <span className="member-nav-badge">{notifCount}</span>}
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
            <div className="member-user-card">
              <div className="member-avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
              <div className="member-user-info">
                <div className="member-user-name">{user.firstName} {user.lastName}</div>
                <div className="member-user-plan">{user.plan ?? "Member"}</div>
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
