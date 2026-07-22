import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Bell, Shield, Save, Check, Eye, EyeOff } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { userAPI } from "../services/api";

export default function ProfileSettings() {
  const { showToast } = useToast();
  const storedUser = JSON.parse(localStorage.getItem("fittrack_user") || "{}");

  const [formData, setFormData] = useState({
    firstName: storedUser.firstName || "Ranuthi",
    lastName: storedUser.lastName || "N.",
    email: storedUser.email || "ranuthi@fittrack.com",
    phone: storedUser.phone || "+94 77 123 4567",
    emergencyContact: storedUser.emergencyContact || "+94 71 987 6543",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifs: true,
    smsNotifs: false,
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    userAPI.getProfile()
      .then((data) => {
        if (data && data.email) {
          setFormData((prev) => ({
            ...prev,
            firstName: data.firstName || prev.firstName,
            lastName: data.lastName || prev.lastName,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            emergencyContact: data.emergencyContact || prev.emergencyContact,
            emailNotifs: data.emailNotifs ?? prev.emailNotifs,
            smsNotifs: data.smsNotifs ?? prev.smsNotifs,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { text: "", score: 0, color: "#CBD5E1" };
    if (pass.length < 6) return { text: "Weak", score: 33, color: "#EF4444" };
    if (pass.length < 10 || !/\d/.test(pass)) return { text: "Medium", score: 66, color: "#F59E0B" };
    return { text: "Strong", score: 100, color: "#10B981" };
  };

  const passStrength = getPasswordStrength(formData.newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      emailNotifs: formData.emailNotifs,
      smsNotifs: formData.smsNotifs,
    };

    userAPI.updateProfile(payload)
      .then((res) => {
        const updatedUser = { ...storedUser, ...res };
        localStorage.setItem("fittrack_user", JSON.stringify(updatedUser));
        setSaved(true);

        if (formData.newPassword) {
          userAPI.changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          })
            .then(() => {
              showToast("Profile details & password updated successfully!", "success");
              setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
            })
            .catch(() => {
              showToast("Profile updated, but current password was incorrect!", "error");
            });
        } else {
          showToast("Profile settings updated successfully!", "success");
        }

        setTimeout(() => setSaved(false), 3000);
      })
      .catch(() => {
        showToast("Error updating profile settings", "error");
      });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Account & Profile Settings</h2>
        <p className="text-muted">Manage your personal details, renewal preferences, and security passwords.</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-grid">
        {/* Personal Details Card */}
        <div className="card profile-card">
          <div className="card-header">
            <h3><User size={20} /> Personal Details</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-control with-icon"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-icon-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    className="form-control with-icon"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  className="form-control"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="card profile-card password-card">
          <div className="card-header">
            <h3><Shield size={20} /> Change Security Password</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showCurrentPass ? "text" : "password"}
                  name="currentPassword"
                  className="form-control with-icon with-pass-toggle"
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="pass-toggle-btn"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                >
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <div className="input-icon-wrapper">
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="newPassword"
                    className="form-control with-pass-toggle"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="pass-toggle-btn"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.newPassword && (
                  <div className="pass-strength-meter mt-2">
                    <div className="strength-bar-bg">
                      <div
                        className="strength-bar-fill"
                        style={{ width: `${passStrength.score}%`, background: passStrength.color }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{ color: passStrength.color }}>
                      {passStrength.text} Password
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-icon-wrapper">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control with-pass-toggle"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="pass-toggle-btn"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card profile-card full-width-card">
          <div className="card-header">
            <h3><Bell size={20} /> Membership Renewal & Alerts</h3>
          </div>
          <div className="card-body toggle-list">
            <div className="toggle-item">
              <div>
                <strong>Email Renewal Reminders</strong>
                <p className="text-muted">Receive membership renewal notices 7 days before billing date.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="emailNotifs"
                  checked={formData.emailNotifs}
                  onChange={handleChange}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <strong>SMS Plan Alerts</strong>
                <p className="text-muted">Get instant SMS updates for card receipts and workout updates.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="smsNotifs"
                  checked={formData.smsNotifs}
                  onChange={handleChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="card-footer" style={{ display: "flex", justifyContent: "flex-end", padding: "16px 24px" }}>
            <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
