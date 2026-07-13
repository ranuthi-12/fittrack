import { useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Features", section: "features" },
  { label: "How it works", section: "how" },
  { label: "Pricing", section: "pricing" },
];

const ACCOUNT_LINKS = [
  { label: "Login", path: "/login" },
  { label: "Register", path: "/register" },
];

const CONTACT_INFO = [
  { icon: Mail, text: "fittrack@gmail.com" },
  { icon: Phone, text: "+94 11 234 5678" },
  { icon: MapPin, text: "Colombo, Sri Lanka" },
];

const SOCIAL_ICONS = [Facebook, Instagram];

export default function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* Brand column */}
        <div>
          <div className="footer-brand"><Dumbbell size={20} /> FitTrack</div>
          <p className="footer-desc">
            A smart gym management platform for members, trainers, and gym owners.
            Built for small local gyms in Sri Lanka.
          </p>
          <div className="footer-social-row">
            {SOCIAL_ICONS.map((Icon, i) => (
              <button key={i} className="footer-social-btn"><Icon size={16} /></button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="footer-col-title">Quick links</div>
          {QUICK_LINKS.map((l) => (
            <button
              key={l.label}
              className="footer-link"
              onClick={() => l.path ? navigate(l.path) : scrollTo(l.section)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Account links */}
        <div>
          <div className="footer-col-title">Account</div>
          {ACCOUNT_LINKS.map((l) => (
            <button
              key={l.label}
              className="footer-link"
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div className="footer-col-title">Contact</div>
          {CONTACT_INFO.map((c) => (
            <div key={c.text} className="footer-contact-item">
              <span><c.icon size={16} /></span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-divider">
        <span className="footer-copy">© 2026 FitTrack. All rights reserved.</span>
        <div className="footer-bottom-links">
          <button className="footer-bottom-link">Privacy policy</button>
          <button className="footer-bottom-link">Terms of use</button>
        </div>
      </div>
    </footer>
  );
}
