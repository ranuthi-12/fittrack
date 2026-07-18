import React, { useState } from "react";
import { Gem, Calendar, Wallet, RefreshCw, Check, CheckCircle2 } from "lucide-react";
import { MOCK_INVOICES, MOCK_UPGRADE_PLANS } from "../../data/memberData";

export default function Membership() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [toast, setToast] = useState(null);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleCancel = () => {
    // TODO: POST /api/membership/cancel
    setCancelled(true); setShowCancelModal(false);
    fireToast("Membership cancelled. You can reactivate anytime.");
  };

  const handleUpgrade = (planName) => {
    // TODO: POST /api/membership/upgrade { plan: planName }
    fireToast(`Upgrade to ${planName} initiated!`);
  };

  const handleDownload = (date) => {
    // TODO: GET /api/membership/invoice/:id → download PDF
    fireToast(`Invoice for ${date} downloaded.`);
  };

  return (
    <>
      <div className="ms-current-plan">
        <div className="ms-plan-badge"><Gem size={22} /></div>
        <div className="ms-plan-info">
          <div className="ms-plan-name">{cancelled ? "Starter Plan" : "Monthly Plan"}</div>
          <div className="ms-plan-meta">
            <span className="ms-plan-meta-item"><Calendar size={14} /> Member since Sep 2024</span>
            {!cancelled && (
              <>
                <span className="ms-plan-meta-item"><Wallet size={14} /> Billed monthly</span>
                <span className="ms-plan-meta-item"><RefreshCw size={14} /> Next renewal: Feb 1, 2025</span>
              </>
            )}
          </div>
        </div>
        <div className="ms-plan-actions">
          {!cancelled && <button className="btn-outline" onClick={() => setShowCancelModal(true)}>Cancel Plan</button>}
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
                <button className="ms-add-payment" onClick={() => fireToast("Add payment method coming soon.")}>+ Add Payment Method</button>
              </>
            ) : (
              <div style={{ color: "var(--color-gray)", fontSize: 13, padding: "16px 0" }}>No active payment methods.</div>
            )}
          </div>
        </div>

        <div className="ms-card">
          <div className="ms-card-header"><div className="ms-card-title">Billing History</div></div>
          <div className="ms-card-body" style={{ padding: "12px 24px 20px" }}>
            {/* TODO: map over data from GET /api/membership/payments */}
            {MOCK_INVOICES.map((inv, i) => (
              <div className="ms-invoice-row" key={i}>
                <span className="ms-invoice-date">{inv.date}</span>
                <span className="ms-invoice-desc">{inv.desc}</span>
                <span className="ms-invoice-amount">{inv.amount}</span>
                <button className="ms-invoice-action" onClick={() => handleDownload(inv.date)}>PDF</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span className="section-tag">Plans</span>
        <h2 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>
          {cancelled ? "Reactivate Your Plan" : "Upgrade Options"}
        </h2>
        <div className="ms-upgrade-grid">
          {/* TODO: map over data from GET /api/plans */}
          {MOCK_UPGRADE_PLANS.map((plan, i) => {
            const isCurrent = plan.current && !cancelled;
            const isCancelledCurrent = plan.name === "Monthly" && cancelled;
            return (
              <div className={`ms-upgrade-card${isCurrent || isCancelledCurrent ? " ms-upgrade-card-current" : ""}`} key={i}>
                {(isCurrent || isCancelledCurrent) && <div className="ms-upgrade-current-tag">Current Plan</div>}
                <div className="ms-upgrade-name">{plan.name}</div>
                <div className="ms-upgrade-price">{plan.price}<span style={{ fontSize: 14, fontWeight: 500 }}>{plan.period}</span></div>
                <ul className="ms-upgrade-features">
                  {plan.features.map((f, j) => (<li className="ms-upgrade-feature" key={j}><span className="ms-upgrade-check"><Check size={12} /></span>{f}</li>))}
                </ul>
                <button className={`ms-upgrade-btn${isCurrent || isCancelledCurrent ? " ms-upgrade-btn-current" : ""}`} onClick={() => handleUpgrade(plan.name)} disabled={isCurrent || isCancelledCurrent}>
                  {isCurrent || isCancelledCurrent ? "Current Plan" : "Upgrade"}
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

      {toast && <div className="member-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </>
  );
}
