import React, { useMemo, useState, useEffect } from "react";
import StatCard from "../../components/StatCard.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";
import { AreaChart, BarChart } from "../../components/AnalyticsCharts.jsx";
import { Download, BarChart3 } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";
import { downloadAdminReportPDF } from "../../utils/pdfGenerator.js";
import { adminAPI } from "../../services/api.js";

export default function Reports() {
  const { stats, newMembersPerMonth } = useGymData();
  const { showToast } = useToast();

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    adminAPI.getRevenueReport()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRevenueData(data);
        }
      })
      .catch(() => {});
  }, []);

  const formattedNewMembers = useMemo(
    () => newMembersPerMonth.map((m) => ({ label: m.label, val: m.value || m.val || 0 })),
    [newMembersPerMonth]
  );

  const displayRevenueData = revenueData;

  const handleExportPDF = () => {
    downloadAdminReportPDF(stats, displayRevenueData, formattedNewMembers);
    showToast("Downloaded full Gym Revenue & Member Analytics PDF report!", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2>Gym Performance & Revenue Reports</h2>
          <p className="text-muted">High-level financial summaries, member retention, and growth metrics.</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportPDF} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={16} /> Export PDF Report
        </button>
      </div>

      <div className="stat-grid stat-grid-2col mb-4">
        <StatCard
          label="Total Monthly Revenue"
          value={`Rs. ${(stats.monthlyRevenue || 0).toLocaleString()}`}
          sub="Live Database Total"
          subTone="positive"
        />
        <StatCard
          label="Active Memberships"
          value={stats.activeMemberships || 0}
          sub="Active in DB"
          subTone="positive"
        />
        <StatCard
          label="Expired Memberships"
          value={stats.expiredMemberships || 0}
          sub="Needs renewal notice"
          subTone="negative"
        />
        <StatCard
          label="Member Retention Rate"
          value="92%"
          sub="High retention"
          subTone="positive"
        />
      </div>

      <div className="reports-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <h3><BarChart3 size={18} /> Revenue Growth (Rs.)</h3>
          </div>
          <div className="card-body">
            {displayRevenueData.length > 0 ? (
              <AreaChart data={displayRevenueData} />
            ) : (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
                No payment records yet.
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><BarChart3 size={18} /> New Member Registrations</h3>
          </div>
          <div className="card-body">
            {formattedNewMembers.length > 0 ? (
              <BarChart data={formattedNewMembers} />
            ) : (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
                No new member data yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
