import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Lightbulb,
  MapPinned,
  ShieldCheck,
  Trash2,
  Wrench
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  ["Road Repairs", Wrench, "Report potholes, damaged dividers, and unsafe road surfaces."],
  ["Street Lighting", Lightbulb, "Raise requests for broken or low-visibility street lights."],
  ["Water Supply", Droplets, "Escalate water leakage, shortage, and pipeline complaints."],
  ["Sanitation", Trash2, "Track garbage collection, public hygiene, and waste issues."]
];

const categories = ["Road Damage", "Street Light", "Water Supply", "Garbage Collection", "Drainage", "Traffic", "Pollution", "Public Toilet"];

const Home = () => {
  return (
    <>
      <section className="public-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="status-pill mb-3">Smart civic response platform</span>
              <h1 className="display-5 fw-bold mb-3">Complaint Management and Smart City Portal</h1>
              <p className="lead mb-4">
                A responsive MERN platform for citizens to report issues, officers to resolve work, and administrators to monitor city operations.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-primary btn-lg" to="/complaints/new">
                  Submit Complaint
                </Link>
                <Link className="btn btn-outline-light btn-lg" to="/track">
                  Track Status
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-metrics bg-white">
                <div>
                  <MapPinned size={32} />
                  <strong>Citywide</strong>
                  <span>Complaint coverage</span>
                </div>
                <div>
                  <ShieldCheck size={32} />
                  <strong>Role-based</strong>
                  <span>Admin and officer access</span>
                </div>
                <div>
                  <BarChart3 size={32} />
                  <strong>Analytics</strong>
                  <span>Live dashboard insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="section-heading">
            <span>Smart City Services</span>
            <h2>Designed for everyday civic issues</h2>
          </div>
          <div className="row g-4">
            {services.map(([title, Icon, text]) => (
              <div className="col-md-6 col-lg-3" key={title}>
                <div className="public-card h-100">
                  <Icon size={30} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-band py-5">
        <div className="container">
          <div className="section-heading">
            <span>How It Works</span>
            <h2>From complaint to resolution</h2>
          </div>
          <div className="row g-4">
            {[
              ["1", "Submit", "Citizen files complaint with location, category, priority, and optional image proof."],
              ["2", "Assign", "Admin reviews and assigns the complaint to a department officer."],
              ["3", "Resolve", "Officer updates status, adds work remarks, and closes the complaint."],
              ["4", "Feedback", "Citizen tracks progress and submits rating after resolution."]
            ].map(([step, title, text]) => (
              <div className="col-md-6 col-lg-3" key={step}>
                <div className="step-card">
                  <span>{step}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="section-heading">
            <span>Complaint Categories</span>
            <h2>Quick reporting for common problems</h2>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <div className="category-pill" key={category}>
                <CheckCircle2 size={18} />
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-lg-3">
              <strong>24x7</strong>
              <span>Complaint tracking</span>
            </div>
            <div className="col-6 col-lg-3">
              <strong>5</strong>
              <span>Status stages</span>
            </div>
            <div className="col-6 col-lg-3">
              <strong>3</strong>
              <span>User roles</span>
            </div>
            <div className="col-6 col-lg-3">
              <strong>100%</strong>
              <span>Digital workflow</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="cta-panel">
            <ClipboardList size={40} />
            <div>
              <h2 className="h3 fw-semibold">Ready to report a city issue?</h2>
              <p className="mb-0">Create a complaint and receive a tracking ID instantly.</p>
            </div>
            <Link className="btn btn-light" to="/complaints/new">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
