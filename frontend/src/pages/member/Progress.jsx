import React, { useState } from "react";
import { Medal } from "lucide-react";
import {
  PERIOD_OPTIONS, MOCK_MEASUREMENTS, MOCK_PERSONAL_RECORDS,
  CHANGE_CLASS, CHANGE_SYMBOL, WEIGHT_DATA_BY_PERIOD, WORKOUT_DATA_BY_PERIOD,
} from "../../data/memberData";

export default function Progress() {
  const [period, setPeriod] = useState("Month");
  // TODO: Replace with → GET /api/progress/chart?period=period
  const weightData = WEIGHT_DATA_BY_PERIOD[period];
  const workoutData = WORKOUT_DATA_BY_PERIOD[period];
  const maxWeight = Math.max(...weightData.map((d) => d.value));
  const minWeight = Math.min(...weightData.map((d) => d.value));
  const weightRange = maxWeight - minWeight || 1;
  const maxWorkout = Math.max(...workoutData.map((d) => d.value));

  return (
    <>
      <div className="pg-period-tabs">
        {PERIOD_OPTIONS.map((p) => (
          <button key={p} className={`pg-period-tab${period === p ? " pg-period-tab-active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
        ))}
      </div>

      <div className="pg-grid">
        <div className="pg-card">
          <div className="pg-card-header">
            <div className="pg-card-title">Body Weight</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>{weightData[weightData.length - 1]?.value} lbs</span>
          </div>
          <div className="pg-card-body">
            <div className="pg-chart">
              {weightData.map((d, i) => {
                const heightPct = ((d.value - minWeight) / weightRange) * 60 + 20;
                return (
                  <div className="pg-chart-bar-wrap" key={i}>
                    <div className="pg-chart-bar-outer">
                      <div className="pg-chart-bar" style={{ height: `${heightPct}%` }}>
                        <div className="pg-chart-tooltip">{d.value} lbs</div>
                      </div>
                    </div>
                    <span className="pg-chart-label">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pg-card">
          <div className="pg-card-header">
            <div className="pg-card-title">Workout Frequency</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>{Math.round(workoutData.reduce((a, b) => a + b.value, 0) / workoutData.length)}/week avg</span>
          </div>
          <div className="pg-card-body">
            <div className="pg-chart">
              {workoutData.map((d, i) => {
                const heightPct = (d.value / maxWorkout) * 80;
                return (
                  <div className="pg-chart-bar-wrap" key={i}>
                    <div className="pg-chart-bar-outer">
                      <div className="pg-chart-bar" style={{ height: `${heightPct}%`, background: "var(--color-bg-green-tint)" }}>
                        <div className="pg-chart-tooltip">{d.value} sessions</div>
                      </div>
                    </div>
                    <span className="pg-chart-label">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TODO: map over data from GET /api/progress/measurements */}
      <div className="pg-card" style={{ marginBottom: 24 }}>
        <div className="pg-card-header">
          <div className="pg-card-title">Body Measurements</div>
          <span style={{ fontSize: 12, color: "var(--color-gray-light)", fontWeight: 500 }}>Last updated: Today</span>
        </div>
        <div className="pg-card-body">
          {MOCK_MEASUREMENTS.map((m, i) => {
            const SymbolIcon = CHANGE_SYMBOL[m.dir];
            return (
            <div className="pg-measurement-row" key={i}>
              <span className="pg-measurement-name">{m.name}</span>
              <div className="pg-measurement-values">
                <span className="pg-measurement-val">{m.current}</span>
                <span className={`pg-measurement-change ${CHANGE_CLASS[m.dir]}`}><SymbolIcon size={12} /> {m.change}</span>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* TODO: map over data from GET /api/progress/records */}
      <div className="pg-card">
        <div className="pg-card-header"><div className="pg-card-title">Personal Records</div></div>
        <div className="pg-card-body">
          <div className="pg-pr-grid">
            {MOCK_PERSONAL_RECORDS.map((pr, i) => (
              <div className="pg-pr-card" key={i}>
                <div className="pg-pr-exercise">{pr.exercise}</div>
                <div className="pg-pr-value">{pr.value} <span className="pg-pr-unit">{pr.unit}</span></div>
                <div className="pg-pr-date"><Medal size={13} /> {pr.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
