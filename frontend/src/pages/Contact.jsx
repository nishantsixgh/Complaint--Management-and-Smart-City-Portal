import { ArrowUpRight, CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      Icon: MapPin,
      eyebrow: "Visit",
      title: "Office & Campus",
      content: (
        <>
          Sandip University
          <br />
          Sijoul, Madhubani
          <br />
          Bihar - 847235
        </>
      ),
    },
    {
      Icon: Phone,
      eyebrow: "Call",
      title: "Helpline",
      content: (
        <>
          <a href="tel:+916200576221" className="contact-link">
            +91 6200576221
          </a>
          <br />
          <a href="tel:+917320893482" className="contact-link">
            +91 7320893482
          </a>
        </>
      ),
    },
    {
      Icon: Mail,
      eyebrow: "Write",
      title: "Email",
      content: (
        <>
          <a href="mailto:nishant805180@gmail.com" className="contact-link">
            nishant805180@gmail.com
          </a>
          <br />
          <a href="mailto:nishant620057@gmail.com" className="contact-link">
            nishant620057@gmail.com
          </a>
        </>
      ),
    },
  ];

  const supportFeatures = [
    {
      Icon: MessageCircle,
      title: "Portal assistance",
      text: "Need help with registration, complaint tracking or using the portal? Reach out to the support desk.",
    },
    {
      Icon: ShieldCheck,
      title: "Civic-first support",
      text: "Complaint information should stay clear, useful and easy to follow from submission to resolution.",
    },
    {
      Icon: Clock3,
      title: "Quick response",
      text: "For urgent civic issues, submit a complaint through the portal so it can be tracked properly.",
    },
  ];

  return (
    <section className="py-5 public-page contact-page">
      <div className="container">
        <div className="contact-hero mb-5">
          <div className="contact-hero-copy">
            <span className="contact-kicker">Smart City Support</span>
            <h1>Let’s make your city work better, together.</h1>
            <p>
              Whether you need portal assistance, want to share feedback, or
              want to understand the project, connect with the team behind the
              Smart City Portal.
            </p>

            <div className="contact-hero-actions">
              <a href="mailto:nishant620057@gmail.com" className="btn btn-primary">
                Email the founder <ArrowUpRight size={17} />
              </a>
              <a href="/track" className="btn btn-outline-light">
                Track a complaint
              </a>
            </div>

            <div className="contact-trust-row">
              <span><CheckCircle2 size={16} /> Citizen focused</span>
              <span><CheckCircle2 size={16} /> Transparent tracking</span>
              <span><CheckCircle2 size={16} /> Easy support</span>
            </div>
          </div>

          <div className="contact-hero-card">
            <div className="contact-mini-icon"><MapPin size={20} /></div>
            <span>Based in Bihar</span>
            <strong>Building a more connected civic experience.</strong>
            <p>Designed around simple reporting, transparent tracking and accessible citizen services.</p>
          </div>
        </div>

        <div className="section-heading text-center contact-section-heading">
          <span>Get in touch</span>
          <h2>Choose the way that works for you</h2>
          <p>Use the right channel for your question and we’ll keep the conversation simple.</p>
        </div>

        <div className="row g-4 mb-5">
          {contactInfo.map(({ Icon, eyebrow, title, content }) => (
            <div className="col-md-4" key={title}>
              <div className="public-card contact-info-card h-100">
                <div className="contact-icon-wrap"><Icon size={22} /></div>
                <span className="contact-card-eyebrow">{eyebrow}</span>
                <h2>{title}</h2>
                <div className="contact-card-content">{content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 align-items-stretch mb-5">
          <div className="col-lg-7">
            <div className="founder-card h-100">
              <div className="founder-photo-wrap">
                <img src="/pic.jpeg" alt="Nishant Singh Vats, Founder of the Smart City Portal" />
                <span className="founder-status"><span /> Founder</span>
              </div>

              <div className="founder-content">
                <span className="contact-kicker">Meet the founder</span>
                <h2>Nishant Singh Vats</h2>
                <p className="founder-role">Founder · Smart City Portal</p>
                <p className="founder-bio">
                  The Smart City Portal is built with a simple goal: make civic
                  communication more accessible, organized and transparent for
                  citizens and the teams working to resolve their issues.
                </p>

                <div className="founder-highlights">
                  <div><strong>01</strong><span>Citizen-first experience</span></div>
                  <div><strong>02</strong><span>Complaint transparency</span></div>
                  <div><strong>03</strong><span>Modern civic technology</span></div>
                </div>

                <a href="mailto:nishant620057@gmail.com" className="founder-contact-link">
                  Connect with Nishant <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="contact-mission-card h-100">
              <span className="contact-kicker">Why this portal</span>
              <h2>Technology that feels human.</h2>
              <p>
                A civic platform should not feel complicated. Every part of the
                experience is designed to help citizens report issues, follow
                progress and stay informed.
              </p>

              <div className="mission-points">
                <div><CheckCircle2 size={18} /><span>Simple complaint submission</span></div>
                <div><CheckCircle2 size={18} /><span>Trackable complaint status</span></div>
                <div><CheckCircle2 size={18} /><span>Role-based city operations</span></div>
                <div><CheckCircle2 size={18} /><span>Accessible support channels</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-heading text-center contact-section-heading">
          <span>Support promise</span>
          <h2>Built around people, not paperwork</h2>
        </div>

        <div className="row g-4">
          {supportFeatures.map(({ Icon, title, text }) => (
            <div className="col-md-4" key={title}>
              <div className="public-card support-feature-card h-100">
                <div className="contact-icon-wrap"><Icon size={21} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
