import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ClipboardList, Timer, Dumbbell, RefreshCw, Check, CheckCircle2, Play, Moon, Download,
} from "lucide-react";
import { MUSCLE_FILTERS, DAY_NAMES } from "../../data/memberData";
import { workoutAPI, progressAPI } from "../../services/api";
import { downloadWorkoutPlanPDF } from "../../utils/pdfGenerator";

function getWeekDays() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { name: DAY_NAMES[d.getDay()], date: d.getDate(), full: d.toISOString().slice(0, 10), isToday: d.toDateString() === today.toDateString() };
  });
}

export default function WorkoutPlan() {
  const weekDays = getWeekDays();
  const todayKey = weekDays.find((d) => d.isToday)?.full || weekDays[0].full;
  const [selectedDay, setSelectedDay] = useState(todayKey);
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showRest, setShowRest] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleExportPDF = () => {
    const selectedDayObj = weekDays.find((d) => d.full === selectedDay);
    const dayName = selectedDayObj ? selectedDayObj.name : "Workout";
    const userStr = localStorage.getItem("fittrack_user");
    const user = userStr ? JSON.parse(userStr) : {};
    downloadWorkoutPlanPDF(`${user.firstName || "Member"} ${user.lastName || ""}`, dayName, exercises);
    fireToast("Workout Plan PDF downloaded!");
  };

  useEffect(() => {
    workoutAPI.getMyPlan()
      .then((plan) => {
        if (plan && Array.isArray(plan.days) && plan.days.length > 0) {
          const selectedDayObj = weekDays.find((d) => d.full === selectedDay);
          const dayName = selectedDayObj ? selectedDayObj.name : "Monday";
          
          const matchedDay = plan.days.find((d) => d.dayName.toLowerCase().startsWith(dayName.toLowerCase().slice(0, 3))) || plan.days[0];
          if (matchedDay && Array.isArray(matchedDay.exercises)) {
            const formatted = matchedDay.exercises.map((e) => ({
              id: e.id,
              name: e.exerciseName,
              sets: `${e.sets || 3} × ${e.reps || 10}`,
              weight: "Bodyweight / Free Weight",
              rest: "60s",
              muscle: matchedDay.focus || "Full Body",
              done: false,
            }));
            setExercises(formatted);
            return;
          }
        }
        setExercises([]);
      })
      .catch(() => {
        setExercises([]);
      });
    setFilter("All");
  }, [selectedDay]);

  const toggleExercise = (id) => {
    setExercises((prev) => prev.map((e) => {
      if (e.id === id) {
        const newDone = !e.done;
        if (newDone && typeof id === "number") {
          progressAPI.log({
            exerciseId: id,
            loggedDate: selectedDay,
            weightKg: 50,
            repsDone: 10,
          }).catch(() => {});
        }
        return { ...e, done: newDone };
      }
      return e;
    }));
  };

  const filteredExercises = filter === "All" ? exercises : exercises.filter((e) => e.muscle === filter);
  const completedCount = exercises.filter((e) => e.done).length;
  const totalCount = exercises.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const startRestTimer = useCallback((seconds = 90) => { setRestTime(seconds); setShowRest(true); }, []);

  useEffect(() => {
    if (!showRest || restTime <= 0) return;
    timerRef.current = setTimeout(() => setRestTime((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [showRest, restTime]);

  useEffect(() => { if (showRest && restTime === 0) fireToast("Rest time is over! Ready for the next set."); }, [showRest, restTime]);

  const formatRest = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const workoutTitle = exercises.length > 0
    ? (() => { const m = [...new Set(exercises.map((e) => e.muscle))]; return m.length <= 3 ? m.join(" / ") + " Day" : "Full Body Day"; })()
    : "Rest Day";

  return (
    <>
      <div className="wp-week-nav">
        {weekDays.map((day) => (
          <button key={day.full} className={`wp-day-btn${selectedDay === day.full ? " wp-day-btn-active" : ""}`} onClick={() => setSelectedDay(day.full)}>
            <span className="wp-day-name">{day.name}</span>
            <span className="wp-day-date">{day.date}</span>
          </button>
        ))}
      </div>

      {exercises.length > 0 ? (
        <>
          <div className="wp-workout-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="wp-workout-title">{workoutTitle}</div>
              <div className="wp-workout-meta">
                <span className="wp-meta-tag"><ClipboardList size={13} /> {totalCount} exercises</span>
                <span className="wp-meta-tag"><Timer size={13} /> ~{totalCount * 6} min</span>
                <span className="wp-meta-tag"><Dumbbell size={13} /> {[...new Set(exercises.map((e) => e.muscle))].length} muscle groups</span>
              </div>
            </div>
            <button className="btn btn-outline" onClick={handleExportPDF} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13 }}>
              <Download size={15} /> Export PDF
            </button>
          </div>
          {exercises.length > 3 && (
            <div className="wp-filter-row">
              {MUSCLE_FILTERS.filter((m) => m === "All" || exercises.some((e) => e.muscle === m)).map((m) => (
                <button key={m} className={`wp-filter-btn${filter === m ? " wp-filter-btn-active" : ""}`} onClick={() => setFilter(m)}>{m}</button>
              ))}
            </div>
          )}
          <div className="wp-exercise-list">
            {filteredExercises.map((ex, i) => (
              <div className={`wp-exercise-card${ex.done ? " wp-exercise-card-done" : ""}`} key={ex.id}>
                <div className={`wp-exercise-num${ex.done ? " wp-exercise-num-done" : ""}`}>{ex.done ? <Check size={14} /> : i + 1}</div>
                <div className="wp-exercise-info">
                  <div className="wp-exercise-name">{ex.name}</div>
                  <div className="wp-exercise-details">
                    <span className="wp-exercise-detail"><RefreshCw size={12} /> {ex.sets}</span>
                    <span className="wp-exercise-detail"><Dumbbell size={12} /> {ex.weight}</span>
                    <span className="wp-exercise-detail"><Timer size={12} /> {ex.rest} rest</span>
                    <span className="wp-exercise-muscle">{ex.muscle}</span>
                  </div>
                </div>
                <button className={`wp-exercise-check${ex.done ? " wp-exercise-check-checked" : ""}`} onClick={() => toggleExercise(ex.id)} title={ex.done ? "Mark incomplete" : "Mark complete"}><Check size={14} /></button>
              </div>
            ))}
          </div>
          <div className="wp-start-bar">
            <div className="wp-progress-summary">
              <div className="wp-progress-bar-wrap"><div className="wp-progress-bar-fill" style={{ width: `${progressPct}%` }} /></div>
              <span className="wp-progress-text">{completedCount}/{totalCount} completed</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-outline" onClick={() => startRestTimer(90)} style={{ padding: "12px 20px", borderRadius: 10, fontSize: 13 }}><Timer size={14} /> Rest Timer</button>
              <button className="wp-start-btn" disabled={completedCount === totalCount && totalCount > 0} onClick={() => { if (completedCount < totalCount) fireToast("Workout started! Complete each exercise."); }}>
                {completedCount === totalCount ? <><CheckCircle2 size={16} /> Workout Complete!</> : <><Play size={16} /> Start Workout</>}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="wp-empty">
          <div className="wp-empty-icon"><Moon size={40} /></div>
          <div className="wp-empty-text">Rest Day</div>
          <div className="wp-empty-sub">No workouts scheduled for this day. Recovery is part of the process!</div>
        </div>
      )}

      {showRest && (
        <div className="wp-rest-modal" onClick={() => setShowRest(false)}>
          <div className="wp-rest-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wp-rest-title">Rest Timer</div>
            <div className="wp-rest-timer">{formatRest(restTime)}</div>
            <div className="wp-rest-btns">
              <button className="wp-rest-skip" onClick={() => setShowRest(false)}>Skip</button>
              <button className="wp-rest-add" onClick={() => setRestTime((t) => t + 30)}>+30s</button>
              <button className="wp-rest-add" onClick={() => setRestTime((t) => t + 60)} style={{ background: "var(--color-blue-800)" }}>+60s</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="member-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </>
  );
}
