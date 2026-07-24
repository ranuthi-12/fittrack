import React, { useState } from "react";
import Avatar from "../../components/Avatar.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";

const EMPTY_FORM = { name: "", specialty: "" };

// =========================================================
// Manage Trainers  (matches screenshot #8)
// ---------------------------------------------------------
// Card list of trainers with their specialty and member count,
// plus "+ Add trainer", "Edit" and "Remove" actions.
// =========================================================
export default function ManageTrainers() {
  const { trainers, addTrainer, updateTrainer, removeTrainer } = useGymData();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setEditingId(trainer.id);
    setForm({ name: trainer.name, specialty: trainer.specialty });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updateTrainer(editingId, form);
    } else {
      addTrainer(form);
    }
    setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (window.confirm("Remove this trainer?")) {
      removeTrainer(id);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add trainer
        </button>
      </div>

      <div className="section-card">
        {trainers.map((trainer, idx) => (
          <div className="activity-item" key={trainer.id}>
            <Avatar name={trainer.name} index={idx} />
            <div style={{ flex: 1 }}>
              <div className="activity-title">{trainer.name}</div>
              <div className="activity-time">
                {trainer.specialty} — {trainer.memberCount} members
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => openEditModal(trainer)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm"
                style={{ background: "#fee2e2", color: "#dc2626" }}
                onClick={() => handleRemove(trainer.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {trainers.length === 0 && (
          <div className="empty-state">No trainers yet.</div>
        )}
      </div>

      {isModalOpen && (
        <TrainerModal
          form={form}
          isEditing={Boolean(editingId)}
          onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function TrainerModal({ form, isEditing, onChange, onSubmit, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{isEditing ? "Edit trainer" : "Add trainer"}</h3>
        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Full name</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Nadeesha Silva"
              required
            />
          </div>
          <div className="field">
            <label>Specialty</label>
            <input
              className="input"
              type="text"
              value={form.specialty}
              onChange={(e) => onChange("specialty", e.target.value)}
              placeholder="e.g. Strength and conditioning"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save changes" : "Add trainer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
