import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LOGIN_BENEFITS } from "../data/landingData";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/login { email, password }
    // On success → localStorage.setItem("fittrack_token", token) → navigate by role
    console.log("Login submit:", form);
  };
  return (
    <div className="root">
      <div className="auth-layout auth-layout-fixed">
        <div className="auth-side">
          <button className="auth-back-btn" onClick={() => navigate("/")}><span className="auth-back-btn-icon"><ArrowLeft size={16} /></span></button>
          <div className="auth-side-content">
            <h1 className="auth-side-title">Welcome back to FitTrack</h1>
            <p className="auth-side-desc">Your fitness journey continues here. Sign in to access your dashboard.</p>
            <ul className="auth-side-list">
              {LOGIN_BENEFITS.map((b) => (<li key={b} className="auth-side-list-item"><span className="auth-side-dot" />{b}</li>))}
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Sign in to your account</h2>
            <p className="auth-form-subtitle">Enter your credentials below to continue</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field"><label className="auth-label" htmlFor="email">Email address</label><input id="email" name="email" type="email" className="auth-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div>
              <div className="auth-field"><label className="auth-label" htmlFor="password">Password</label><input id="password" name="password" type="password" className="auth-input" placeholder="Enter your password" value={form.password} onChange={handleChange} required /></div>
              <div className="auth-options-row"><button type="button" className="auth-forgot-link" onClick={() => navigate("/forgot-password")}>Forgot password?</button></div>
              <button type="submit" className="auth-submit-btn">Sign in</button>
            </form>
            <p className="auth-footer-text">Don't have an account? <button className="auth-footer-link" onClick={() => navigate("/register")}>Create one</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
