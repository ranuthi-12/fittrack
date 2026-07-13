import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import { FEATURES, HOW_IT_WORKS, PLANS, STATS } from "../data/landingData";

export default function LandingPage() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="root">
      <Navbar />
      <section id="hero" className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge"><CheckCircle2 size={16} /> Trusted by 200+ gym members in Sri Lanka</div>
            <h1 className="hero-title">Your gym, managed <span className="hero-accent">smarter</span></h1>
            <p className="hero-desc">Track memberships, follow personalized workout plans, and monitor your progress — all from one clean, easy-to-use platform.</p>
            <div className="hero-btns">
              <button className="btn-large btn-large-primary" onClick={() => window.location.href = "/register"}>Get started free <ArrowRight size={18} /></button>
              <button className="btn-large btn-large-outline" onClick={() => scrollTo("how-it-works")}>See how it works</button>
            </div>
          </div>
        </div>
        
        <div className="stats-bar">
          {STATS.map((s) => (
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
      
    </div>
  );
}
