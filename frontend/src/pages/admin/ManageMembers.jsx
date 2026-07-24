import React, { useMemo, useState } from "react";
import Avatar from "../../components/Avatar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const EMPTY_FORM = { name: "", plan: "Monthly", status: "Active", expiry: "" };

// =========================================================
// Manage Members  (matches screenshot #6)
// ---------------------------------------------------------
// Full member table for the admin with:
//   - live search by name
//   - "+ Add member" opens a modal to create a member
//   - "Edit" opens the same modal pre-filled to update
//   - "Delete" (shown for expired members, like in the
//     screenshot) removes the member immediately
// =========================================================
export default function ManageMembers() {
  const { members, addMember, updateMember, deleteMember } = useGymData();

  const [query, setQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = "adding new"
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, query]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      plan: member.plan,
      status: member.status,
      expiry: member.expiry,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updateMember(editingId, form);
    } else {
      addMember({
        ...form,
        joined: new Date().toISOString().slice(0, 10),
        trainerId: "t1",
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this member?")) {
      deleteMember(id);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <h1 className="page-title">All members</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input search-input"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add member
          </button>
        </div>
      </div>

      <div className="section-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member, idx) => (
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
                <td>{formatDate(member.expiry)}</td>
                <td>
                  {member.status === "Expired" ? (
                    <button
                      className="btn-danger-link"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="btn-link"
                      onClick={() => openEditModal(member)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No members found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <MemberModal
          form={form}
          isEditing={Boolean(editingId)}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Small inline modal for creating / editing a member. Kept in this
// file since it's only used here, but could be split out the same
// way Sidebar.jsx was if it needed to be reused elsewhere.
function MemberModal({ form, isEditing, onChange, onSubmit, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{isEditing ? "Edit member" : "Add member"}</h3>
        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Full name</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Dilan Perera"
              required
            />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Plan</label>
            <select
              className="input"
              value={form.plan}
              onChange={(e) => onChange("plan", e.target.value)}
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annual</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
            >
              <option>Active</option>
              <option>Expiring</option>
              <option>Expired</option>
            </select>
          </div>
          <div className="field">
            <label>Expiry date</label>
            <input
              className="input"
              type="date"
              value={form.expiry}
              onChange={(e) => onChange("expiry", e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
