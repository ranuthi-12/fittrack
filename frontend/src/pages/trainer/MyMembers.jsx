import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";

// =========================================================
// My Members  (matches screenshot #2)
// ---------------------------------------------------------
// Lists every member assigned to the logged-in trainer with a
// live search box and a "View progress" button that jumps to
// the Monitor progress page pre-filtered to that member.
// =========================================================
export default function MyMembers() {
  const { myMembers: members } = useGymData();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, query]);

  const goToProgress = (memberId) => {
    navigate(`/trainer/progress?member=${memberId}`);
  };

  return (
    <div>
      <div className="page-header-row">
        <input
          className="input search-input"
          type="text"
          placeholder="Search members..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="section-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Plan</th>
              <th>Status</th>
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
                <td>
                  <button
                    className="btn-link"
                    onClick={() => goToProgress(member.id)}
                  >
                    View progress
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">No members match your search.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
