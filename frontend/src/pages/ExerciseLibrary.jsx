import React, { useState, useEffect } from "react";
import { Search, Dumbbell, PlayCircle, Layers, Filter, CheckCircle } from "lucide-react";
import { exerciseAPI } from "../services/api";

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [exercisesList, setExercisesList] = useState([]);

  const CATEGORIES = ["All", "Chest", "Back", "Legs", "Arms", "Shoulders", "Core", "Cardio"];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    exerciseAPI.getAll(selectedCategory === "All" ? "" : selectedCategory, searchQuery)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((ex) => ({
            id: ex.id ? `ex-${ex.id}` : ex.name,
            name: ex.exerciseName || ex.name,
            category: ex.category || "General",
            level: ex.level || "Beginner",
            equipment: ex.equipment || "Standard",
            muscles: Array.isArray(ex.muscles) ? ex.muscles : (ex.muscles || "").split(","),
            instructions: ex.instructions || "Perform exercise with proper form.",
            recommended: ex.recommended || "3 sets x 10 reps",
            videoThumbnail: ex.videoThumbnail || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
          }));
          setExercisesList(formatted);
        } else {
          setExercisesList([]);
        }
        setLoaded(true);
      })
      .catch(() => {
        setExercisesList([]);
        setLoaded(true);
      });
  }, [selectedCategory, searchQuery]);

  const filteredExercises = exercisesList.filter((ex) => {
    const matchesCategory = selectedCategory === "All" || ex.category === selectedCategory;
    const matchesQuery =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="exercise-library-page">
      <div className="page-header">
        <div>
          <h2>Exercise Guide & Workout Library</h2>
          <p className="text-muted">Explore proper form, muscle targeting, and exercise instructions.</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="library-filters">
        <div className="input-icon-wrapper search-box">
          <Search size={16} className="input-icon" />
          <input
            type="text"
            className="form-control with-icon"
            placeholder="Search exercises or muscle groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      {loaded && filteredExercises.length === 0 && (
        <div className="empty-state" style={{ padding: "40px 0", textAlign: "center", color: "var(--color-gray)" }}>
          No exercises found.
        </div>
      )}
      <div className="exercise-grid">
        {filteredExercises.map((ex) => (
          <div key={ex.id} className="card exercise-card">
            <div className="exercise-thumb-wrapper">
              <img src={ex.videoThumbnail} alt={ex.name} className="exercise-thumb" />
              <span className="exercise-badge-level">{ex.level}</span>
            </div>

            <div className="card-body">
              <div className="exercise-card-header">
                <h3>{ex.name}</h3>
                <span className="badge badge-primary">{ex.category}</span>
              </div>

              <div className="exercise-meta">
                <span><Dumbbell size={14} /> {ex.equipment}</span>
                <span><Layers size={14} /> {ex.recommended}</span>
              </div>

              <p className="exercise-instructions">{ex.instructions}</p>

              <div className="muscle-tags">
                <strong>Target Muscles:</strong>
                <div className="tags-wrapper">
                  {ex.muscles.map((m) => (
                    <span key={m} className="tag">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
