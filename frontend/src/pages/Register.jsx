import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { REGISTER_BENEFITS, MEMBERSHIP_PLANS } from "../data/landingData";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", plan: "MONTHLY" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/register { firstName, lastName, email, phone, password, plan }
    // On success → navigate("/login")
    console.log("Register submit:", form);
  };
  return (
    <div className="root">
      <div className="auth-layout">
        <div className="auth-side">
          <button className="auth-back-btn" onClick={() => navigate("/")}><span className="auth-back-btn-icon"><ArrowLeft size={16} /></span></button>
          <div className="auth-side-content">
            <h1 className="auth-side-title">Join FitTrack today</h1>
            <p className="auth-side-desc">Create your account and start your fitness journey with a personalized plan.</p>
            <ul className="auth-side-list">
              {REGISTER_BENEFITS.map((b) => (<li key={b} className="auth-side-list-item"><span className="auth-side-dot" />{b}</li>))}
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Fill in your details to get started</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-row">
                <div className="auth-field"><label className="auth-label" htmlFor="firstName">First name</label><input id="firstName" name="firstName" type="text" className="auth-input" placeholder="Ranuthi" value={form.firstName} onChange={handleChange} required /></div>
                <div className="auth-field"><label className="auth-label" htmlFor="lastName">Last name</label><input id="lastName" name="lastName" type="text" className="auth-input" placeholder="Silva" value={form.lastName} onChange={handleChange} required /></div>
              </div>
              <div className="auth-field"><label className="auth-label" htmlFor="email">Email address</label><input id="email" name="email" type="email" className="auth-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div>
              <div className="auth-field"><label className="auth-label" htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" className="auth-input" placeholder="07X XXX XXXX" value={form.phone} onChange={handleChange} required /></div>
              <div className="auth-field"><label className="auth-label" htmlFor="password">Password</label><input id="password" name="password" type="password" className="auth-input" placeholder="Create a strong password" value={form.password} onChange={handleChange} required /></div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="plan">Membership plan</label>
                <select id="plan" name="plan" className="auth-select" value={form.plan} onChange={handleChange}>
                  {MEMBERSHIP_PLANS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                </select>
              </div>
              <button type="submit" className="auth-submit-btn">Create account</button>
            </form>
            <p className="auth-footer-text">Already have an account? <button className="auth-footer-link" onClick={() => navigate("/login")}>Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
