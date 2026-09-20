import { BarChart3, CheckCircle2, ClipboardList, Droplets, Lightbulb, MapPinned, ShieldCheck, Trash2, Wrench, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  ["Road Repairs", Wrench, "Report potholes, damaged dividers and unsafe road surfaces."],
  ["Street Lighting", Lightbulb, "Raise requests for broken or low-visibility street lights."],
  ["Water Supply", Droplets, "Report leakage, shortage and pipeline-related issues."],
  ["Sanitation", Trash2, "Track garbage collection, hygiene and waste concerns."]
];
const categories = ["Road Damage","Street Light","Water Supply","Garbage Collection","Drainage","Traffic","Pollution","Public Toilet"];

export default function Home() {
  return (
    <main className="home-premium">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-eyebrow"><span /> SMART CIVIC PLATFORM</div>
            <h1>Make your city<br /><em>better, together.</em></h1>
            <p className="home-hero-text">Report civic problems, follow every update and help create a cleaner, safer and more responsive community.</p>
            <div className="home-actions">
              <Link className="home-btn home-btn-primary" to="/complaints/new">Submit a complaint <ArrowUpRight size={18}/></Link>
              <Link className="home-btn home-btn-ghost" to="/track">Track complaint</Link>
            </div>
            <div className="home-proof"><ShieldCheck size={17}/><span>Transparent workflow</span><i/> <MapPinned size={17}/><span>Citywide access</span></div>
          </div>
          <div className="home-hero-visual">
            <div className="home-orbit home-orbit-a" />
            <div className="home-orbit home-orbit-b" />
            <div className="home-glass-card home-glass-main">
              <div className="home-card-top"><span>LIVE CIVIC DESK</span><b>● Active</b></div>
              <div className="home-city-mark"><MapPinned size={30}/></div>
              <strong>One portal.<br/>Every civic concern.</strong>
              <p>From first report to final resolution.</p>
              <div className="home-mini-stats"><span><b>24×7</b>Tracking</span><span><b>100%</b>Digital</span></div>
            </div>
            <div className="home-float-card home-float-one"><CheckCircle2 size={20}/><div><b>Issue resolved</b><small>Complaint #SC-2048</small></div></div>
            <div className="home-float-card home-float-two"><BarChart3 size={20}/><div><b>Smart analytics</b><small>City operations</small></div></div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head"><span>CORE SERVICES</span><h2>Built for the issues<br/>people face every day.</h2><p>Simple reporting for citizens. Clear workflows for the teams resolving them.</p></div>
        <div className="home-service-grid">
          {services.map(([title, Icon, text]) => <article className="home-service-card" key={title}><div className="home-service-icon"><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><Link to="/complaints/new">Report issue <ArrowUpRight size={15}/></Link></article>)}
        </div>
      </section>

      <section className="home-workflow">
        <div className="home-section-head light"><span>THE WORKFLOW</span><h2>From report to resolution,<br/>nothing gets lost.</h2></div>
        <div className="home-steps">
          {[["01","SUBMIT","Describe the issue with location, category and optional proof."],["02","ASSIGN","The right department receives and reviews your complaint."],["03","RESOLVE","Officers update progress and add resolution remarks."],["04","FEEDBACK","Track the outcome and share your experience."]].map(([n,t,d])=><div className="home-step" key={n}><b>{n}</b><div><span>{t}</span><h3>{d}</h3></div></div>)}
        </div>
      </section>

      <section className="home-section home-category-section">
        <div className="home-section-head"><span>QUICK REPORTING</span><h2>Common problems,<br/>one place to report them.</h2></div>
        <div className="home-category-grid">{categories.map(c=><Link to="/complaints/new" className="home-category" key={c}><CheckCircle2 size={17}/>{c}<ArrowUpRight size={15}/></Link>)}</div>
      </section>

      <section className="home-final">
        <div><ClipboardList size={28}/><span>READY TO GET STARTED?</span><h2>Your next civic report<br/>can start here.</h2></div>
        <Link className="home-btn home-btn-light" to="/complaints/new">Create a complaint <ArrowUpRight size={18}/></Link>
      </section>
    </main>
  );
}