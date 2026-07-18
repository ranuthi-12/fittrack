import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Hand, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { MOCK_MEMBER_STATS, MOCK_SCHEDULE, MOCK_ACTIVITIES, STATUS_MAP, COLOR_MAP } from "../../data/memberData";

export default function MemberHome() {
  const navigate = useNavigate();
  // TODO: fetch stats from GET /api/member/dashboard
  // TODO: fetch schedule from GET /api/workout/today
  // TODO: fetch activities from GET /api/member/activity

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  });

  return (
    <>
      <div className="mh-welcome">
        <div className="mh-welcome-bg"><Dumbbell size={120} /></div>
        <div className="mh-welcome-title">{greeting}, John! <Hand size={22} style={{ display: "inline", verticalAlign: "middle" }} /></div>
        <p className="mh-welcome-desc">You're on a 12-day streak — keep it up! You have 2 more sessions scheduled for today.</p>
        <button className="mh-welcome-btn" onClick={() => navigate("/member/workout-plan")}>View Today's Workouts <ArrowRight size={16} /></button>
      </div>

      <div className="mh-stats">
        {MOCK_MEMBER_STATS.map((s, i) => (
          <div className="mh-stat-card" key={i}>
            <div className="mh-stat-header">
              <div className={`mh-stat-icon ${COLOR_MAP[s.color]}`}><s.icon size={20} /></div>
              <span className={`mh-stat-trend ${s.up ? "mh-stat-trend-up" : "mh-stat-trend-down"}`}>{s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {s.trend}</span>
            </div>
            <div className="mh-stat-value">{s.value}</div>
            <div className="mh-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mh-grid">
        <div className="mh-card">
          <div className="mh-card-header">
            <div className="mh-card-title">Today's Schedule</div>
            <button className="mh-card-link" onClick={() => navigate("/member/workout-plan")}>View All <ArrowRight size={14} /></button>
          </div>
          <div className="mh-card-body">
            {MOCK_SCHEDULE.map((s, i) => (
              <div className="mh-schedule-item" key={i}>
                <span className="mh-schedule-time">{s.time}</span>
                <div className="mh-schedule-info">
                  <div className="mh-schedule-name">{s.name}</div>
                  <div className="mh-schedule-meta">{s.meta}</div>
                </div>
                <span className={`mh-schedule-status ${STATUS_MAP[s.status].cls}`}>{STATUS_MAP[s.status].label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mh-card">
          <div className="mh-card-header">
            <div className="mh-card-title">Recent Activity</div>
            <button className="mh-card-link" onClick={() => navigate("/member/notifications")}>See All <ArrowRight size={14} /></button>
          </div>
          <div className="mh-card-body">
            {MOCK_ACTIVITIES.map((a, i) => (
              <div className="mh-activity-item" key={i}>
                <div className="mh-activity-dot" style={{ background: a.color }} />
                <div>
                  <div className="mh-activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div className="mh-activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
