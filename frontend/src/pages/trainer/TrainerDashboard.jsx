import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";
import { trainerAPI } from "../../services/api";

// =========================================================
// Trainer Dashboard
// ---------------------------------------------------------
// Shows three summary tiles (My members / Plans assigned /
// Pending plans) followed by a "Recent activity" feed.
// Stats come live from GET /api/trainer/stats (real counts
// from the trainer_member and workout_plan tables) and the
// activity feed comes from GET /api/trainer/activity.
// =========================================================
export default function TrainerDashboard() {
  const { activity } = useGymData();
  const [stats, setStats] = useState({ myMembers: 0, plansAssigned: 0, pendingPlans: 0 });

  useEffect(() => {
    trainerAPI.getStats()
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="stat-grid">
        <StatCard label="My members" value={stats.myMembers} />
        <StatCard label="Plans assigned" value={stats.plansAssigned} />
        <StatCard label="Pending plans" value={stats.pendingPlans} />
      </div>

      <h2 className="section-card-title">Recent activity</h2>
      <div className="section-card">
        {activity.length === 0 && (
          <div className="empty-state">No recent activity yet.</div>
        )}
        {activity.map((item) => (
          <div className="activity-item" key={item.id}>
            <div className={`activity-dot ${item.color}`} />
            <div>
              <div className="activity-title">{item.title}</div>
              <div className="activity-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
