import { Award, Building2, UsersRound } from "lucide-react";

const About = () => {
  return (
    <section className="py-5 public-page">
      <div className="container">
        <div className="section-heading">
          <span>About</span>
          <h1>Modern complaint handling for smarter cities</h1>
          <p>
            This portal connects citizens, officers, and administrators in one transparent workflow for civic issue resolution.
          </p>
        </div>
        <div className="row g-4">
          {[
            [Building2, "City Operations", "Centralize complaints from roads, water, sanitation, traffic, lighting, and public amenities."],
            [UsersRound, "Role Workflows", "Citizens submit and track, officers update work, and admins assign and analyze."],
            [Award, "College Ready", "Clean MERN architecture with authentication, dashboards, charts, uploads, and feedback."]
          ].map(([Icon, title, text]) => (
            <div className="col-md-4" key={title}>
              <div className="public-card h-100">
                <Icon size={32} />
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

export default About;
