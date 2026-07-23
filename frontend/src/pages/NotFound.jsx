import React from "react";
import { Link } from "react-router-dom";
import { Dumbbell, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-icon">
          <Dumbbell size={48} />
        </div>
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-desc">
          Oops! The workout page or route you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary notfound-btn">
          <ArrowLeft size={18} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
