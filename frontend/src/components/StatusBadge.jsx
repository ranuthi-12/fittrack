import React from "react";

// Maps a status string to the right pill color, matching the
// green / yellow / red badges seen in the member tables.
const STATUS_CLASS = {
  Active: "badge-active",
  Expiring: "badge-expiring",
  Expired: "badge-expired",
};

export default function StatusBadge({ status }) {
  const className = STATUS_CLASS[status] || "badge-active";
  return <span className={`badge ${className}`}>{status}</span>;
}
