import React from "react";

// A single metric tile, e.g. "Total members / 42 / +7 this month".
// `subTone` controls the color of the small sub-label under the
// number: "positive" (green), "negative" (red) or "neutral" (gray).
export default function StatCard({ label, value, sub, subTone = "neutral" }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className={`stat-sub ${subTone}`}>{sub}</div>}
    </div>
  );
}
