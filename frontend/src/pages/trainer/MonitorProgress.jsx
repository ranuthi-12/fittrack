import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGymData } from "../../context/GymDataContext.jsx";
import { progressAPI } from "../../services/api";

// =========================================================
// Monitor Progress
// ---------------------------------------------------------
// Top-right dropdown selects which member's progress to view.
// Progress is loaded live from /api/progress/member/{id},
// which reads real progress_log rows from the database.
// =========================================================
export default function MonitorProgress() {
  const { myMembers: members } = useGymData();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("member");

  const [memberId, setMemberId] = useState(preselected || members[0]?.id || "");
  const [logs, setLogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (preselected) setMemberId(preselected);
  }, [preselected]);

  useEffect(() => {
    if (!memberId) return;
    setLoaded(false);
    const selectedMember = members.find((m) => m.id === memberId);
    const rawId = selectedMember?.rawId || memberId.replace(/^m/, "");
    progressAPI.getMemberProgress(rawId)
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        setLogs([]);
        setLoaded(true);
      });
  }, [memberId, members]);

  const selectedMember = members.find((m) => m.id === memberId);

  const exerciseSummary = useMemo(() => {
    const byExercise = {};
    logs.forEach((l) => {
      if (!l.exercise) return;
      const name = l.exercise.exerciseName;
      if (!byExercise[name]) byExercise[name] = { id: name, name, value: 0, unit: "kg", target: 1, color: "blue" };
      const w = Number(l.weightKg || 0);
      if (w > byExercise[name].value) byExercise[name].value = w;
      byExercise[name].target = Math.max(byExercise[name].target, w);
    });
    return Object.values(byExercise);
  }, [logs]);

  const workoutsLogged = new Set(logs.map((l) => l.loggedDate)).size;
  const completionRate = workoutsLogged > 0 ? Math.min(100, Math.round((workoutsLogged / 12) * 100)) : 0;

  return (
    <div>
      <div className="page-header-row">
        <select
          className="input"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="stat-grid stat-grid-2col">
        <div className="card">
          <div className="stat-label">Workouts logged</div>
          <div className="stat-value">{workoutsLogged}</div>
        </div>
        <div className="card">
          <div className="stat-label">Completion rate</div>
          <div className="stat-value" style={{ color: "#16a34a" }}>
            {completionRate}%
          </div>
        </div>
      </div>

      <h2 className="section-card-title">Exercise progress</h2>
      <div className="card">
        {!loaded && <div className="empty-state">Loading...</div>}

        {loaded && exerciseSummary.length === 0 && (
          <div className="empty-state">
            No progress logged yet for {selectedMember?.name ?? "this member"}.
          </div>
        )}

        {exerciseSummary.map((ex) => {
          const percent = ex.target > 0 ? Math.min(100, Math.round((ex.value / ex.target) * 100)) : 0;
          return (
            <div className="progress-row" key={ex.id}>
              <div className="progress-row-top">
                <span>{ex.name}</span>
                <span>
                  {ex.value} {ex.unit}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill ${ex.color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
