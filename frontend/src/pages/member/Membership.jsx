import React, { useState, useEffect } from "react";
import { Gem, Calendar, Wallet, RefreshCw, Check, CheckCircle2, CreditCard } from "lucide-react";
import { UPGRADE_PLANS } from "../../data/memberData";
import PaymentModal from "../../components/PaymentModal";
import { useToast } from "../../context/ToastContext";
import { membershipAPI } from "../../services/api";
import { downloadInvoicePDF } from "../../utils/pdfGenerator";

export default function Membership() {
  const { showToast } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const [currentMembership, setCurrentMembership] = useState({
    planName: "Monthly Plan",
    memberSince: "Sep 2024",
    billingCycle: "Monthly",
    nextRenewal: "Feb 1, 2025",
    amountPaid: 2500,
    status: "ACTIVE",
  });

  const [invoices, setInvoices] = useState([]);

  const loadData = () => {
    membershipAPI.getMy()
      .then((data) => {
        if (data && data.planType) {
          setCurrentMembership({
            planName: `${data.planType} Plan`,
            memberSince: data.startDate || "Sep 2024",
            billingCycle: data.planType,
            nextRenewal: data.endDate || "2026-07-30",
            amountPaid: data.amountPaid || 2500,
            status: data.status || "ACTIVE",
          });
        }
      })
      .catch(() => {});

    membershipAPI.getPayments()
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          const formatted = list.map((item) => ({
            id: item.id,
            date: item.startDate || "2026-06-01",
            desc: `${item.planType} Plan`,
            amount: `Rs. ${item.amountPaid}`,
          }));
          setInvoices(formatted);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = () => {
    setCancelled(true);
    setShowCancelModal(false);
    showToast("Membership cancelled. You can reactivate anytime.", "info");
  };

  const handleUpgrade = (plan) => {
    const rawPrice = typeof plan.price === "number"
      ? plan.price
      : parseFloat(String(plan.price || "2500").replace(/[^0-9.]/g, "")) || 2500;

    setSelectedPlanForPayment({
      title: `${plan.name || "Monthly"} Plan`,
      price: rawPrice,
      duration: (plan.period || "").includes("yr") || (plan.name || "").includes("Annual") ? "1 Year" :
                (plan.period || "").includes("3") || (plan.name || "").includes("Quarterly") ? "3 Months" : "1 Month",
    });
    setPaymentModalOpen(true);
  };

  const handleDownload = (inv) => {
    const userStr = localStorage.getItem("fittrack_user");
    const user = userStr ? JSON.parse(userStr) : {};
    downloadInvoicePDF({
      id: inv.id || Math.floor(100000 + Math.random() * 900000),
      memberName: `${user.firstName || "Gym"} ${user.lastName || "Member"}`,
      email: user.email || "member@fittrack.com",
      date: inv.date,
      plan: inv.desc,
      amount: inv.amount,
      status: "PAID",
      paymentMethod: "Credit Card / Online",
    });
    showToast(`Invoice downloaded successfully as PDF!`, "success");
  };

  return (
    <>
      <div className="ms-current-plan">
        <div className="ms-plan-badge"><Gem size={22} /></div>
        <div className="ms-plan-info">
          <div className="ms-plan-name">{cancelled ? "Starter Plan" : currentMembership.planName}</div>
          <div className="ms-plan-meta">
            <span className="ms-plan-meta-item"><Calendar size={14} /> Member since {currentMembership.memberSince}</span>
            {!cancelled && (
              <>
                <span className="ms-plan-meta-item"><Wallet size={14} /> Billed {currentMembership.billingCycle}</span>
                <span className="ms-plan-meta-item"><RefreshCw size={14} /> Next renewal: {currentMembership.nextRenewal}</span>
              </>
            )}
          </div>
        </div>
        <div className="ms-plan-actions" style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => handleUpgrade({ name: "Monthly", price: "Rs. 2,500", period: "/ month" })}>
            <CreditCard size={16} /> Renew Now
          </button>
          {!cancelled && <button className="btn-outline btn-sm" onClick={() => setShowCancelModal(true)}>Cancel Plan</button>}
        </div>
      </div>

      <div className="ms-grid">
        <div className="ms-card">
          <div className="ms-card-header"><div className="ms-card-title">Payment Methods</div></div>
          <div className="ms-card-body">
            {!cancelled ? (
              <>
                <div className="ms-payment-row">
                  <div className="ms-payment-icon">VISA</div>
                  <div className="ms-payment-details">
                    <div className="ms-payment-number">•••• •••• •••• 4242</div>
                    <div className="ms-payment-expiry">Expires 08/27</div>
                  </div>
                  <span className="ms-payment-default">Default</span>
                </div>
                <button className="ms-add-payment" onClick={() => handleUpgrade({ name: "Monthly", price: "Rs. 2,500", period: "/ month" })}>
                  + Add Payment Method
                </button>
              </>
            ) : (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "16px 0" }}>No active payment methods.</div>
            )}
          </div>
        </div>

        <div className="ms-card">
          <div className="ms-card-header"><div className="ms-card-title">Billing History</div></div>
          <div className="ms-card-body" style={{ padding: "12px 24px 20px" }}>
            {invoices.length === 0 ? (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "16px 0" }}>No billing history yet.</div>
            ) : (
              invoices.map((inv, i) => (
                <div className="ms-invoice-row" key={i}>
                  <span className="ms-invoice-date">{inv.date}</span>
                  <span className="ms-invoice-desc">{inv.desc}</span>
                  <span className="ms-invoice-amount">{inv.amount}</span>
                  <button className="ms-invoice-action" onClick={() => handleDownload(inv)}>PDF</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span className="section-tag">Plans</span>
        <h2 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>
          {cancelled ? "Reactivate Your Plan" : "Upgrade Options"}
        </h2>
        <div className="ms-upgrade-grid">
          {UPGRADE_PLANS.map((plan, i) => {
            const isCurrent = plan.current && !cancelled;
            const isCancelledCurrent = plan.name === "Monthly" && cancelled;
            return (
              <div className={`ms-upgrade-card${isCurrent || isCancelledCurrent ? " ms-upgrade-card-current" : ""}`} key={i}>
                {(isCurrent || isCancelledCurrent) && <div className="ms-upgrade-current-tag">Current Plan</div>}
                <div className="ms-upgrade-name">{plan.name}</div>
                <div className="ms-upgrade-price">{plan.price}<span style={{ fontSize: 14, fontWeight: 500 }}>{plan.period}</span></div>
                <ul className="ms-upgrade-features">
                  {plan.features.map((f, j) => (
                    <li className="ms-upgrade-feature" key={j}>
                      <span className="ms-upgrade-check"><Check size={12} /></span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`ms-upgrade-btn${isCurrent || isCancelledCurrent ? " ms-upgrade-btn-current" : ""}`}
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrent || isCancelledCurrent}
                >
                  {isCurrent || isCancelledCurrent ? "Current Plan" : "Upgrade & Pay"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {!cancelled && (
        <div className="ms-cancel-section">
          <div className="ms-cancel-text">Want to switch to the free Starter plan? You won't be charged again and can reactivate anytime.</div>
          <button className="ms-cancel-btn" onClick={() => setShowCancelModal(true)}>Cancel Subscription</button>
        </div>
      )}

      {showCancelModal && (
        <div className="ms-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ms-modal-title">Cancel Your Subscription?</div>
            <div className="ms-modal-desc">You'll lose access to features at the end of your billing period. Your data will be preserved for 90 days.</div>
            <div className="ms-modal-btns">
              <button className="ms-modal-cancel" onClick={() => setShowCancelModal(false)}>Keep Plan</button>
              <button className="ms-modal-confirm" onClick={handleCancel}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        plan={selectedPlanForPayment}
        onSuccess={loadData}
      />
    </>
  );
}
