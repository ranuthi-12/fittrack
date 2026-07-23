import React, { useState, useEffect } from "react";
import { Check, Circle, X, Bell, CheckCircle2 } from "lucide-react";
import {
  NOTIFICATION_FILTER_TABS, NOTIFICATION_TYPE_MAP,
  NOTIFICATION_FILTER_TYPE_MAP,
} from "../../data/memberData";
import { notificationAPI } from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadNotifications = () => {
    notificationAPI.getMy()
      .then((data) => {
        if (Array.isArray(data)) {
          setLoadError(null);
          const formatted = data.map((n) => {
            const rawType = (n.type || "GENERAL").toUpperCase();
            let type = "system";
            if (rawType.includes("WORKOUT")) type = "workout";
            else if (rawType.includes("PAYMENT") || rawType.includes("MEMBERSHIP")) type = "membership";
            else if (rawType.includes("ACHIEVE") || rawType.includes("RECORD") || rawType.includes("PR")) type = "achievement";

            return {
              id: n.id,
              type,
              title: n.title,
              desc: n.message,
              time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
              unread: !n.isRead,
            };
          });
          setNotifications(formatted);
        }
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
        setLoadError(err?.message || "Couldn't load notifications.");
      });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered = NOTIFICATION_FILTER_TYPE_MAP[activeFilter] == null
    ? notifications
    : notifications.filter((n) => n.type === NOTIFICATION_FILTER_TYPE_MAP[activeFilter]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleReadStatus = (id, isUnread) => {
    if (isUnread) {
      notificationAPI.markAsRead(id)
        .then(() => {
          setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
        })
        .catch(() => {
          setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
        });
    } else {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: true } : n));
    }
  };

  const deleteNotification = (id) => {
    notificationAPI.delete(id)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fireToast("Notification deleted.");
      })
      .catch(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fireToast("Notification removed.");
      });
  };

  const markAllRead = () => {
    notificationAPI.markAllRead()
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        fireToast("All notifications marked as read.");
      })
      .catch(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        fireToast("All notifications marked as read.");
      });
  };

  const clearAll = () => {
    setNotifications([]);
    fireToast("Notifications view cleared.");
  };

  return (
    <>
      {loadError && (
        <div style={{
          background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#B91C1C",
          borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13,
        }}>
          Couldn't load notifications ({loadError}). Try refreshing the page.
        </div>
      )}
      <div className="nf-header-row">
        <div className="nf-filters">
          {NOTIFICATION_FILTER_TABS.map((tab) => {
            const filterType = NOTIFICATION_FILTER_TYPE_MAP[tab];
            const count = filterType == null
              ? notifications.length
              : notifications.filter((n) => n.type === filterType).length;
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
            const typeInfo = NOTIFICATION_TYPE_MAP[n.type] || NOTIFICATION_TYPE_MAP.system;
            const Icon = typeInfo.icon || Bell;
            return (
              <div className={`nf-item${n.unread ? " nf-item-unread" : ""}`} key={n.id}>
                {n.unread ? <div className="nf-item-dot" /> : <div className="nf-item-dot nf-item-dot-read" />}
                <div className={`nf-icon ${typeInfo.cls}`}><Icon size={18} /></div>
                <div className="nf-body">
                  <div className="nf-title">{n.title}</div>
                  <div className="nf-desc">{n.desc}</div>
                  <div className="nf-time">{n.time}</div>
                </div>
                <div className="nf-actions">
                  <button className="nf-action-btn" onClick={() => toggleReadStatus(n.id, n.unread)} title={n.unread ? "Mark as read" : "Mark as unread"}>
                    {n.unread ? <Check size={14} /> : <Circle size={14} />}
                  </button>
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
