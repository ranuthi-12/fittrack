import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useGymData } from "../../context/GymDataContext.jsx";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let exerciseIdCounter = 1;
const newExerciseRow = () => ({
  rowId: `row-${exerciseIdCounter++}`,
  name: "",
  sets: "",
  reps: "",
});

// =========================================================
// Assign Workout Plan  (matches screenshot #3)
// ---------------------------------------------------------
// Form to build a workout plan for a selected member:
//   - pick member + plan name + day
//   - add any number of exercise rows (name / sets / reps)
//   - "Save plan" pushes the plan into GymDataContext
// =========================================================
export default function AssignPlan() {
  const { myMembers, saveWorkoutPlan } = useGymData();

  const [memberId, setMemberId] = useState(myMembers[0]?.id ?? "");
  const [planName, setPlanName] = useState("");
  const [day, setDay] = useState("Monday");
  const [exercises, setExercises] = useState([newExerciseRow(), newExerciseRow()]);
  const [savedMessage, setSavedMessage] = useState("");

  // myMembers loads asynchronously; default the selection once it arrives.
  useEffect(() => {
    if (!memberId && myMembers.length > 0) {
      setMemberId(myMembers[0].id);
    }
  }, [myMembers]);

  const updateExercise = (rowId, field, value) => {
    setExercises((prev) =>
      prev.map((row) => (row.rowId === rowId ? { ...row, [field]: value } : row))
    );
  };

  const addExerciseRow = () => {
    setExercises((prev) => [...prev, newExerciseRow()]);
  };

  const removeExerciseRow = (rowId) => {
    setExercises((prev) => prev.filter((row) => row.rowId !== rowId));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const cleanedExercises = exercises
      .filter((row) => row.name.trim() !== "")
      .map((row) => ({
        id: row.rowId,
        name: row.name,
        sets: Number(row.sets) || 0,
        reps: Number(row.reps) || 0,
      }));

    if (!memberId || cleanedExercises.length === 0) {
      setSavedMessage("Add at least one exercise before saving.");
      return;
    }

    saveWorkoutPlan(memberId, {
      day,
      planName: planName || "Untitled plan",
      exercises: cleanedExercises,
    });

    setSavedMessage("Plan saved successfully.");
    setPlanName("");
    setExercises([newExerciseRow(), newExerciseRow()]);
  };

  return (
    <div>

      <form className="section-card" style={{ padding: 24 }} onSubmit={handleSave}>
        <div className="form-grid">
          <div className="field">
            <label>Select member</label>
            <select
              className="input"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              {myMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Plan name</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Beginner strength"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>
        </div>

        <div className="field" style={{ marginBottom: 20, maxWidth: 240 }}>
          <label>Day</label>
          <select className="input" value={day} onChange={(e) => setDay(e.target.value)}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ marginBottom: 12 }}>
          <label>Exercises</label>
        </div>

        {exercises.map((row) => (
          <div className="exercise-row" key={row.rowId}>
            <input
              className="input"
              type="text"
              placeholder="Exercise name"
              value={row.name}
              onChange={(e) => updateExercise(row.rowId, "name", e.target.value)}
            />
            <input
              className="input"
              type="number"
              min="0"
              placeholder="Sets"
              value={row.sets}
              onChange={(e) => updateExercise(row.rowId, "sets", e.target.value)}
            />
            <input
              className="input"
              type="number"
              min="0"
              placeholder="Reps"
              value={row.reps}
              onChange={(e) => updateExercise(row.rowId, "reps", e.target.value)}
            />
            <button
              type="button"
              className="btn-danger-link"
              onClick={() => removeExerciseRow(row.rowId)}
              aria-label="Remove exercise"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="button" className="btn btn-outline" onClick={addExerciseRow}>
            + Add exercise
          </button>
          <button type="submit" className="btn btn-primary">
            Save plan
          </button>
        </div>

        {savedMessage && (
          <p style={{ marginTop: 16, fontSize: 13, color: "#16a34a" }}>{savedMessage}</p>
        )}
      </form>
    </div>
  );
}

