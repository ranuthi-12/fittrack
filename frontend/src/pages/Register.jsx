import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { REGISTER_BENEFITS, MEMBERSHIP_PLANS } from "../data/landingData";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    plan: "MONTHLY",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      showToast("Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await authAPI.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        plan: form.plan,
      });

      if (data && data.token) {
        localStorage.setItem("fittrack_token", data.token);
        localStorage.setItem(
          "fittrack_user",
          JSON.stringify({
            id: data.userId || "usr-reg",
            firstName: data.firstName || form.firstName,
            lastName: data.lastName || form.lastName,
            email: data.email || form.email,
            role: data.role || "MEMBER",
            plan: form.plan,
          })
        );
        showToast("Registration successful! Welcome to FitTrack.", "success");
        navigate("/member");
      } else {
        setError("Registration failed. Please try again.");
        showToast("Registration failed. Please try again.", "error");
      }
    } catch (err) {
      const message = err.message || "Registration failed. Please check your details and try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <div className="auth-layout">
        <div className="auth-side">
          <button className="auth-back-btn" onClick={() => navigate("/")}>
            <span className="auth-back-btn-icon">←</span> Back to home
          </button>
          <div className="auth-side-content">
            <h1 className="auth-side-title">Join FitTrack today</h1>
            <p className="auth-side-desc">Start your fitness journey with a personalized plan.</p>
            <ul className="auth-side-list">
              {REGISTER_BENEFITS.map((b) => (
                <li key={b} className="auth-side-list-item">
                  <span className="auth-side-dot" />{b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="auth-main">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Fill in your details to get started</p>

            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "12px 14px", marginBottom: "16px", fontSize: "13px", color: "#991B1B" }}>
                ❌ {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-row">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="auth-input"
                    placeholder="Ranuthi"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="auth-input"
                    placeholder="Silva"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="auth-input"
                  placeholder="07X XXX XXXX"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-row">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="password">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      style={{ paddingRight: "38px" }}
                      placeholder="Strong password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748B",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input"
                      style={{ paddingRight: "38px" }}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748B",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="plan">Membership plan</label>
                <select
                  id="plan"
                  name="plan"
                  className="auth-select"
                  value={form.plan}
                  onChange={handleChange}
                >
                  {MEMBERSHIP_PLANS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="auth-footer-text">
              Already have an account?{" "}
              <button className="auth-footer-link" onClick={() => navigate("/login")}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
