import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-close the mobile menu if the window is resized back to desktop width
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    if (!isLanding) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? " navbar-scrolled" : ""}${menuOpen ? " navbar-menu-open" : ""}`}>
      {/* Brand */}
      <button className="navbar-brand" onClick={() => goTo("/")}>
        <Dumbbell size={20} /> FitTrack
      </button>

      {/* Mobile menu toggle */}
      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop, mobile only, shown while menu is open */}
      {menuOpen && <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Links + actions — a normal inline row on desktop, a slide-down panel on mobile */}
      <div className={`navbar-panel${menuOpen ? " navbar-panel-open" : ""}`}>
        <div className="navbar-links" style={{ alignItems: "center" }}>
          <button className="navbar-link" onClick={() => scrollTo("features")}>
            Features
          </button>
          <button className="navbar-link" onClick={() => scrollTo("how-it-works")}>
            How it works
          </button>
          <button className="navbar-link" onClick={() => scrollTo("pricing")}>
            Pricing
          </button>
        </div>

        <div className="navbar-actions">
          <button className="btn-outline" onClick={() => goTo("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => goTo("/register")}>
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
