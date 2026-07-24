import React, { useMemo, useState } from "react";
import Avatar from "../../components/Avatar.jsx";
import { useGymData } from "../../context/GymDataContext.jsx";
import { downloadPaymentSummaryPDF, downloadInvoicePDF } from "../../utils/pdfGenerator.js";
import { Download, Plus, Search, Filter, FileText, X } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PaymentTracking() {
  const { payments, members, recordPayment } = useGymData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [newPayment, setNewPayment] = useState({
    memberId: "",
    plan: "Monthly Plan",
    amount: 2500,
    date: new Date().toISOString().slice(0, 10),
  });

  const totalCollected = useMemo(
    () =>
      payments
        .filter((p) => p.status === "Paid" || p.status === "ACTIVE")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const pendingRenewals = members.filter((m) => m.status === "Expiring").length;

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        (p.memberName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.plan || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Paid" && (p.status === "Paid" || p.status === "ACTIVE")) ||
        (statusFilter === "Expired" && p.status === "Expired");
      return matchSearch && matchStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const handleExportSummaryPDF = () => {
    downloadPaymentSummaryPDF(filteredPayments, totalCollected);
    showToast("Payment Summary PDF downloaded!", "success");
  };

  const handleDownloadInvoice = (payment) => {
    downloadInvoicePDF({
      id: payment.id,
      memberName: payment.memberName,
      date: payment.date,
      plan: payment.plan,
      amount: payment.amount,
      status: payment.status === "Expired" ? "EXPIRED" : "PAID",
      paymentMethod: "Cash / Direct Ledger",
    });
    showToast(`Receipt for ${payment.memberName} downloaded!`, "success");
  };

  const handleAddPaymentSubmit = (e) => {
    e.preventDefault();
    const selectedMember = members.find((m) => m.id === newPayment.memberId) || members[0];
    if (!selectedMember) {
      showToast("Please select a member first", "error");
      return;
    }

    recordPayment({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      plan: newPayment.plan,
      amount: Number(newPayment.amount),
      date: newPayment.date,
      status: "Paid",
    });

    showToast(`Offline payment recorded for ${selectedMember.name}!`, "success");
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2>Payment & Revenue Management</h2>
          <p className="text-muted">Monitor transactions, renewals, and offline payment receipts.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={handleExportSummaryPDF} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={16} /> Export Ledger PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> Record Payment
          </button>
        </div>
      </div>

      <div className="stat-grid stat-grid-2col mb-4">
        <div className="card">
          <div className="stat-label">Total Revenue Collected</div>
          <div className="stat-value" style={{ color: "#16a34a" }}>
            Rs. {totalCollected.toLocaleString()}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">Pending Renewals</div>
          <div className="stat-value" style={{ color: "#b45309" }}>
            {pendingRenewals}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="input-icon-wrapper" style={{ flex: 1 }}>
          <Search size={16} className="input-icon" />
          <input
            type="text"
            className="form-control with-icon"
            placeholder="Search payments by member or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ maxWidth: 160 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid / Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <h2 className="section-card-title">Recent Payment Transactions</h2>
      <div className="section-card">
        {filteredPayments.map((payment, idx) => (
          <div className="activity-item" key={payment.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <Avatar name={payment.memberName} index={idx} />
              <div>
                <div className="activity-title">
                  {payment.memberName} — {payment.plan}
                </div>
                <div className="activity-time">{formatDate(payment.date)}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {payment.status === "Expired" ? (
                <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>
                  Expired
                </span>
              ) : (
                <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>
                  Rs. {Number(payment.amount).toLocaleString()}
                </span>
              )}
              <button
                className="btn-outline btn-sm"
                onClick={() => handleDownloadInvoice(payment)}
                title="Download Receipt PDF"
                style={{ padding: "4px 8px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
              >
                <FileText size={14} /> Receipt
              </button>
            </div>
          </div>
        ))}
        {filteredPayments.length === 0 && (
          <div className="empty-state">No payment records found.</div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, padding: 24 }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: 16 }}>Record Offline Payment</h3>
            <form onSubmit={handleAddPaymentSubmit}>
              <div className="form-group mb-3">
                <label>Select Member</label>
                <select
                  className="form-control"
                  value={newPayment.memberId}
                  onChange={(e) => setNewPayment({ ...newPayment, memberId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.plan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Plan Type</label>
                <select
                  className="form-control"
                  value={newPayment.plan}
                  onChange={(e) => setNewPayment({ ...newPayment, plan: e.target.value })}
                >
                  <option value="Monthly Plan">Monthly Plan (Rs. 2,500)</option>
                  <option value="Quarterly Plan">Quarterly Plan (Rs. 6,500)</option>
                  <option value="Annual Plan">Annual Plan (Rs. 22,000)</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Amount Paid (Rs.)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block mt-3" style={{marginTop: "10px", width: "100%"}}>
                Save & Record Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
