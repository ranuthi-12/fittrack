import React from "react";

// Turns "Ranuthi N." into "RN", "Admin" into "AD", etc.
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("");
}

// A small colored circle with initials, used for members, trainers,
// and the logged-in user badge in the top bar / sidebar.
// `index` picks one of 5 preset colors (see .avatar-0..4 in index.css)
// so avatars look varied without needing per-person color data.
export default function Avatar({ name, index = 0 }) {
  const colorClass = `avatar-${index % 5}`;
  return (
    <div className={`avatar ${colorClass}`} title={name}>
      {getInitials(name)}
    </div>
  );
}
