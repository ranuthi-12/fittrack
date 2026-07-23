import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Check, Users, Dumbbell, Award, Flame } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FEATURES, HOW_IT_WORKS, PLANS, STATS } from "../data/landingData";
import { publicAPI } from "../services/api";

export default function LandingPage() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const [liveStats, setLiveStats] = useState([
    { label: "Active Members", value: "200+", icon: Users },
    { label: "Expert Trainers", value: "6", icon: Award },
    { label: "Workouts Tracked", value: "1,500+", icon: Dumbbell },
    { label: "Member Satisfaction", value: "99%", icon: Flame },
  ]);

  useEffect(() => {
    publicAPI.getLandingStats()
      .then((res) => {
        if (res) {
          setLiveStats([
            { label: "Active Members", value: `${res.totalMembers || 200}+`, icon: Users },
            { label: "Expert Trainers", value: `${res.activeTrainers || 6}`, icon: Award },
            { label: "Workouts Tracked", value: `${res.totalWorkouts || 1500}+`, icon: Dumbbell },
            { label: "Member Satisfaction", value: res.satisfactionRate || "99%", icon: Flame },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="root">
      <Navbar />
      <section id="hero" className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge"><CheckCircle2 size={16} /> Trusted by gym members in Sri Lanka</div>
            <h1 className="hero-title">Your gym, managed <span className="hero-accent">smarter</span></h1>
            <p className="hero-desc">Track memberships, follow personalized workout plans, and monitor your progress — all from one clean, easy-to-use platform.</p>
            <div className="hero-btns">
              <button className="btn-large btn-large-primary" onClick={() => window.location.href = "/register"}>Get started free <ArrowRight size={18} /></button>
              <button className="btn-large btn-large-outline" onClick={() => scrollTo("how-it-works")}>See how it works</button>
            </div>
          </div>
        </div>
        
        <div className="stats-bar">
          {liveStats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">
                {s.value}
                {s.icon && <s.icon size={18} style={{ marginLeft: 4, verticalAlign: "middle" }} />}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="section-alt">
        <div className="section-inner">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Everything your gym needs</h2>
          <p className="section-desc">From membership management to workout tracking — FitTrack gives members, trainers, and admins exactly what they need.</p>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card">
                <span className="feat-icon"><f.icon size={28} /></span>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <span className="section-tag">How it works</span>
        <h2 className="section-title">Get started in 3 simple steps</h2>
        <p className="section-desc">FitTrack is designed to be simple. No complicated setup — just register, get your plan, and start tracking.</p>
        <div className="how-grid">
          {HOW_IT_WORKS.map((h) => (
            <div key={h.step} className="how-card">
              <span className="how-step">{h.step}</span>
              <div className="how-title">{h.title}</div>
              <div className="how-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="section-alt">
        <div className="section-inner">
          <span className="section-tag">Pricing</span>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-desc">Choose the plan that fits your fitness journey. No hidden fees, no surprises.</p>
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`pricing-card${plan.highlighted ? " pricing-card-highlighted" : ""}`}>
                {plan.highlighted && <div className="pricing-badge">Most popular</div>}
                <div className={`pricing-name${plan.highlighted ? " pricing-name-highlighted" : ""}`}>{plan.name}</div>
                <div className={`pricing-price${plan.highlighted ? " pricing-price-highlighted" : ""}`}>{plan.price}</div>
                <span className={`pricing-period${plan.highlighted ? " pricing-period-highlighted" : ""}`}>{plan.period}</span>
                <ul className="pricing-features">
                  {plan.features.map((f) => (
                    <li key={f} className={`pricing-feature${plan.highlighted ? " pricing-feature-highlighted" : ""}`}>
                      <span className={`pricing-check${plan.highlighted ? " pricing-check-highlighted" : ""}`}><Check size={12} /></span>{f}
                    </li>
                  ))}
                </ul>
                <button className={`pricing-btn${plan.highlighted ? " pricing-btn-highlighted" : ""}`} onClick={() => window.location.href = "/register"}>Get started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready to transform your gym experience?</h2>
        <p className="cta-desc">Join hundreds of members already using FitTrack to manage their fitness journey.</p>
        <div className="cta-btns">
          <button className="btn-large btn-large-cta-white" onClick={() => window.location.href = "/register"}>Create your account</button>
          <button className="btn-large btn-large-cta-outline" onClick={() => window.location.href = "/login"}>Sign in</button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
