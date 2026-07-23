import React, { useState, useEffect, useMemo } from "react";
import { Medal, Download } from "lucide-react";
import { PERIOD_OPTIONS } from "../../data/memberData";
import { LineChart, BarChart } from "../../components/AnalyticsCharts";
import { progressAPI } from "../../services/api";
import { downloadProgressReportPDF } from "../../utils/pdfGenerator";
import { useToast } from "../../context/ToastContext";

const PERIOD_DAYS = { Week: 7, Month: 30, "3 Months": 90, Year: 365 };

export default function Progress() {
  const { showToast } = useToast();
  const [period, setPeriod] = useState("Month");
  const [logs, setLogs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    progressAPI.getMy()
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load progress logs:", err);
        setLoadError(err?.message || "Couldn't load your progress data.");
        setLoaded(true);
      });
  }, []);

  const filteredLogs = useMemo(() => {
    const days = PERIOD_DAYS[period] || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return logs
      .filter((l) => l.loggedDate && new Date(l.loggedDate) >= cutoff)
      .sort((a, b) => new Date(a.loggedDate) - new Date(b.loggedDate));
  }, [logs, period]);

  // Weight lifted over time (per logged entry, most recent per day)
  const weightChartData = useMemo(() => {
    const byDate = {};
    filteredLogs.forEach((l) => {
      if (l.weightKg != null) byDate[l.loggedDate] = Number(l.weightKg);
    });
    return Object.entries(byDate).map(([date, val]) => ({
      label: date.slice(5), // MM-DD
      val,
    }));
  }, [filteredLogs]);

  // Workout sessions per week within the period
  const workoutChartData = useMemo(() => {
    const byWeek = {};
    filteredLogs.forEach((l) => {
      const d = new Date(l.loggedDate);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(5, 10);
      byWeek[key] = (byWeek[key] || 0) + 1;
    });
    return Object.entries(byWeek).map(([label, val]) => ({ label, val }));
  }, [filteredLogs]);

  // Personal records: best (max) weight per exercise from all-time logs
  const personalRecords = useMemo(() => {
    const best = {};
    logs.forEach((l) => {
      if (!l.exercise || l.weightKg == null) return;
      const name = l.exercise.exerciseName;
      const w = Number(l.weightKg);
      if (!best[name] || w > best[name].value) {
        best[name] = { exercise: name, value: w, unit: "kg", date: l.loggedDate };
      }
    });
    return Object.values(best).sort((a, b) => b.value - a.value);
  }, [logs]);

  const latestWeight = weightChartData.length > 0 ? weightChartData[weightChartData.length - 1].val : null;
  const avgSessionsPerWeek = workoutChartData.length > 0
    ? Math.round(workoutChartData.reduce((a, b) => a + b.val, 0) / workoutChartData.length)
    : 0;

  const handleExportPDF = () => {
    const userStr = localStorage.getItem("fittrack_user");
    const user = userStr ? JSON.parse(userStr) : {};
    downloadProgressReportPDF(`${user.firstName || "Member"} ${user.lastName || ""}`, logs, personalRecords);
    showToast("Progress & PR PDF Report downloaded!", "success");
  };

  return (
    <>
      {loadError && (
        <div style={{
          background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#B91C1C",
          borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13,
        }}>
          Couldn't load your progress data ({loadError}). Try refreshing the page.
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="pg-period-tabs" style={{ marginBottom: 0 }}>
          {PERIOD_OPTIONS.map((p) => (
            <button key={p} className={`pg-period-tab${period === p ? " pg-period-tab-active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
        <button className="btn btn-outline" onClick={handleExportPDF} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Download size={15} /> Export Progress PDF
        </button>
      </div>

      <div className="pg-grid">
        <div className="pg-card">
          <div className="pg-card-header">
            <div className="pg-card-title">Weight Lifted (kg)</div>
            {latestWeight != null && (
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>
                {latestWeight} kg
              </span>
            )}
          </div>
          <div className="pg-card-body">
            {weightChartData.length > 0 ? (
              <LineChart data={weightChartData} />
            ) : (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
                {loaded ? "No workouts logged in this period yet." : "Loading..."}
              </div>
            )}
          </div>
        </div>

        <div className="pg-card">
          <div className="pg-card-header">
            <div className="pg-card-title">Workout Sessions</div>
            {workoutChartData.length > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>
                {avgSessionsPerWeek}/week avg
              </span>
            )}
          </div>
          <div className="pg-card-body">
            {workoutChartData.length > 0 ? (
              <BarChart data={workoutChartData} />
            ) : (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
                {loaded ? "No workouts logged in this period yet." : "Loading..."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pg-card">
        <div className="pg-card-header"><div className="pg-card-title">Personal Records</div></div>
        <div className="pg-card-body">
          {personalRecords.length === 0 ? (
            <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "16px 0" }}>
              {loaded ? "No personal records yet — log a workout to get started." : "Loading..."}
            </div>
          ) : (
            <div className="pg-pr-grid">
              {personalRecords.map((pr, i) => (
                <div className="pg-pr-card" key={i}>
                  <div className="pg-pr-exercise">{pr.exercise}</div>
                  <div className="pg-pr-value">{pr.value} <span className="pg-pr-unit">{pr.unit}</span></div>
                  <div className="pg-pr-date"><Medal size={13} /> {pr.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
