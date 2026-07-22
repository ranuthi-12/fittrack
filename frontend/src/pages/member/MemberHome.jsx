import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Hand, ArrowRight, ArrowUp, ArrowDown, Flame, Zap, Calendar } from "lucide-react";
import { userAPI, progressAPI, workoutAPI, notificationAPI } from "../../services/api";

export default function MemberHome() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Member");
  const [stats, setStats] = useState([
    { icon: Dumbbell, label: "Workouts This Month", value: "0", trend: "0 completed", up: true, color: "blue" },
    { icon: Flame, label: "Completion Rate", value: "0%", trend: "Tracked", up: true, color: "amber" },
    { icon: Zap, label: "Total Sessions", value: "0 days", trend: "Keep going!", up: true, color: "green" },
    { icon: Calendar, label: "Next Session", value: "Today", trend: "Workout Scheduled", up: true, color: "purple" },
  ]);

  const [schedule, setSchedule] = useState([
    { time: "09:00 AM", name: "Full Body Workout", meta: "45 min · Strength & Conditioning", status: "upcoming" },
  ]);

  const [activities, setActivities] = useState([]);

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  });

  useEffect(() => {
    // 1. Get user profile name
    userAPI.getProfile()
      .then((user) => {
        if (user && user.firstName) {
          setUserName(user.firstName);
        }
      })
      .catch(() => {});

    // 2. Get progress stats
    progressAPI.getStats()
      .then((res) => {
        if (res) {
          setStats([
            { icon: Dumbbell, label: "Workouts This Month", value: `${res.workoutsThisMonth || 0}`, trend: "+2 this week", up: true, color: "blue" },
            { icon: Flame, label: "Completion Rate", value: `${res.completionRate || 0}%`, trend: "Target: 100%", up: true, color: "amber" },
            { icon: Zap, label: "Total Sessions", value: `${res.totalWorkouts || 0} sessions`, trend: "Personal best", up: true, color: "green" },
            { icon: Calendar, label: "Next Session", value: "Today", trend: "Workout Active", up: true, color: "purple" },
          ]);
        }
      })
      .catch(() => {});

    // 3. Get workout plan for schedule
    workoutAPI.getMyPlan()
      .then((plan) => {
        if (plan && plan.days && plan.days.length > 0) {
          const formattedSchedule = plan.days.map((d, index) => ({
            time: `${8 + index * 2}:00 AM`,
            name: `${d.dayName} - ${d.focus || "Workout"}`,
            meta: `${(d.exercises || []).length} exercises scheduled`,
            status: index === 0 ? "done" : "upcoming",
          }));
          setSchedule(formattedSchedule);
        }
      })
      .catch(() => {});

    // 4. Get recent notifications as activity feed
    notificationAPI.getMy()
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          const formattedAct = list.slice(0, 5).map((n) => ({
            text: `<strong>${n.title}</strong> — ${n.message}`,
            time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
            color: n.isRead ? "#059669" : "var(--color-primary)",
          }));
          setActivities(formattedAct);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="mh-welcome">
        <div className="mh-welcome-bg"><Dumbbell size={120} /></div>
        <div className="mh-welcome-title">{greeting}, {userName}! <Hand size={22} style={{ display: "inline", verticalAlign: "middle" }} /></div>
        <p className="mh-welcome-desc">Welcome to FitTrack. Check your workouts, log progress, and connect with trainers!</p>
        <button className="mh-welcome-btn" onClick={() => navigate("/member/workout-plan")}>View Today's Workouts <ArrowRight size={16} /></button>
      </div>

      <div className="mh-stats">
        {stats.map((s, i) => (
          <div className="mh-stat-card" key={i}>
            <div className="mh-stat-header">
              <div className={`mh-stat-icon mh-stat-icon-${s.color}`}><s.icon size={20} /></div>
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
            {schedule.map((s, i) => (
              <div className="mh-schedule-item" key={i}>
                <span className="mh-schedule-time">{s.time}</span>
                <div className="mh-schedule-info">
                  <div className="mh-schedule-name">{s.name}</div>
                  <div className="mh-schedule-meta">{s.meta}</div>
                </div>
                <span className={`mh-schedule-status ${s.status === "done" ? "mh-status-done" : "mh-status-upcoming"}`}>{s.status === "done" ? "Done" : "Upcoming"}</span>
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
            {activities.map((a, i) => (
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
