import React from "react";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Avatar from "../../components/Avatar.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";

// Format a date string like "2026-06-01" as "01 Jun 2026"
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// =========================================================
// Admin Overview  (matches screenshot #5)
// ---------------------------------------------------------
// Six summary tiles + a "Recent members" table, all derived
// from GymDataContext.stats / members so the numbers move
// together with the Manage members / Payments / Trainers
// screens.
// =========================================================
export default function AdminDashboard() {
  const { stats, members } = useGymData();

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.joined) - new Date(a.joined))
    .slice(0, 5);

  return (
    <div>
      
      <div className="stat-grid">
        <StatCard
          label="Total members"
          value={stats.totalMembers}
          sub="+7 this month"
          subTone="neutral"
        />
        <StatCard
          label="Expiring soon"
          value={stats.expiringSoon}
          sub="Within 7 days"
          subTone="neutral"
        />
        <StatCard
          label="Monthly revenue"
          value={`Rs. ${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          sub="+12% vs last month"
          subTone="positive"
        />
        <StatCard label="Active trainers" value={stats.activeTrainers} />
        <StatCard
          label="Expired memberships"
          value={stats.expiredMemberships}
          sub={stats.expiredMemberships > 0 ? "Needs attention" : undefined}
          subTone="negative"
        />
        <StatCard label="Active memberships" value={stats.activeMemberships} />
      </div>

      <h2 className="section-card-title">Recent members</h2>
      <div className="section-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentMembers.map((member, idx) => (
              <tr key={member.id}>
                <td>
                  <div className="name-cell">
                    <Avatar name={member.name} index={idx} />
                    <span>{member.name}</span>
                  </div>
                </td>
                <td>{member.plan}</td>
                <td>
                  <StatusBadge status={member.status} />
                </td>
                <td>{formatDate(member.joined)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
