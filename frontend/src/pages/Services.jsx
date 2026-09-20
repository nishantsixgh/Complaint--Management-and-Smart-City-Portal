import { Car, Droplets, Lightbulb, Recycle, ShieldAlert, ShowerHead, Trees, Waves, Wrench } from "lucide-react";

const services = [
  ["Road Damage", Wrench],
  ["Street Light", Lightbulb],
  ["Water Supply", Droplets],
  ["Garbage Collection", Recycle],
  ["Drainage", Waves],
  ["Traffic", Car],
  ["Pollution", ShieldAlert],
  ["Public Toilet", ShowerHead],
  ["Park Maintenance", Trees]
];

const Services = () => {
  return (
    <section className="py-5 public-page">
      <div className="container">
        <div className="section-heading">
          <span>Services</span>
          <h1>Complaint categories supported by the portal</h1>
        </div>
        <div className="row g-4">
          {services.map(([title, Icon]) => (
            <div className="col-sm-6 col-lg-4" key={title}>
              <div className="public-card service-card h-100">
                <Icon size={32} />
                <h2>{title}</h2>
                <p>Submit, track, and resolve {title.toLowerCase()} complaints through a structured digital workflow.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
