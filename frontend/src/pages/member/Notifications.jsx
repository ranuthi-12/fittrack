import React, { useState } from "react";
import { Check, Circle, X, Bell, CheckCircle2 } from "lucide-react";
import {
  NOTIFICATION_FILTER_TABS, NOTIFICATION_TYPE_MAP,
  NOTIFICATION_FILTER_TYPE_MAP, MOCK_NOTIFICATIONS,
} from "../../data/memberData";

export default function Notifications() {
  // TODO: Replace with → GET /api/notifications/my
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = NOTIFICATION_FILTER_TYPE_MAP[activeFilter] === null
    ? notifications
    : notifications.filter((n) => n.type === NOTIFICATION_FILTER_TYPE_MAP[activeFilter]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    // TODO: PUT /api/notifications/:id/read
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  };

  const markAsUnread = (id) => {
    // TODO: PUT /api/notifications/:id/unread
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: true } : n));
  };

  const deleteNotification = (id) => {
    // TODO: DELETE /api/notifications/:id
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    fireToast("Notification deleted.");
  };

  const markAllRead = () => {
    // TODO: PUT /api/notifications/read-all
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    fireToast("All notifications marked as read.");
  };

  const clearAll = () => {
    // TODO: DELETE /api/notifications/all
    setNotifications([]);
    fireToast("All notifications cleared.");
  };

  return (
    <>
      <div className="nf-header-row">
        <div className="nf-filters">
          {NOTIFICATION_FILTER_TABS.map((tab) => {
            const count = tab === "All" ? notifications.length : notifications.filter((n) => n.type === NOTIFICATION_FILTER_TYPE_MAP[tab]).length;
            return (
              <button key={tab} className={`nf-filter-btn${activeFilter === tab ? " nf-filter-btn-active" : ""}`} onClick={() => setActiveFilter(tab)}>
                {tab}<span style={{ marginLeft: 6, opacity: 0.6, fontSize: 11 }}>({count})</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {unreadCount > 0 && <button className="nf-mark-all" onClick={markAllRead}>Mark all as read</button>}
          {notifications.length > 0 && <button className="nf-mark-all" onClick={clearAll} style={{ color: "#DC2626" }}>Clear all</button>}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="nf-list">
          {filtered.map((n) => {
            const typeInfo = NOTIFICATION_TYPE_MAP[n.type];
            return (
              <div className={`nf-item${n.unread ? " nf-item-unread" : ""}`} key={n.id}>
                {n.unread ? <div className="nf-item-dot" /> : <div className="nf-item-dot nf-item-dot-read" />}
                <div className={`nf-icon ${typeInfo.cls}`}><typeInfo.icon size={18} /></div>
                <div className="nf-body">
                  <div className="nf-title">{n.title}</div>
                  <div className="nf-desc">{n.desc}</div>
                  <div className="nf-time">{n.time}</div>
                </div>
                <div className="nf-actions">
                  {n.unread
                    ? <button className="nf-action-btn" onClick={() => markAsRead(n.id)} title="Mark as read"><Check size={14} /></button>
                    : <button className="nf-action-btn" onClick={() => markAsUnread(n.id)} title="Mark as unread"><Circle size={14} /></button>}
                  <button className="nf-action-btn" onClick={() => deleteNotification(n.id)} title="Delete" style={{ color: "#DC2626" }}><X size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="nf-empty">
          <div className="nf-empty-icon"><Bell size={40} /></div>
          <div className="nf-empty-title">{activeFilter === "All" ? "No notifications" : `No ${activeFilter.toLowerCase()} notifications`}</div>
          <div className="nf-empty-desc">{activeFilter === "All" ? "You're all caught up! Check back later." : `There are no ${activeFilter.toLowerCase()} notifications to show.`}</div>
        </div>
      )}
      {toast && <div className="member-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </>
  );
}
