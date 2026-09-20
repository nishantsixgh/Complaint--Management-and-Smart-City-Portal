import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      Icon: MapPin,
      title: "Office",
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
      title: "Helpline",
      content: (
        <>
          <a href="tel:+916200576221" className="text-decoration-none">
            +91 6200576221
          </a>
          <br />
          <a href="tel:+917320893482" className="text-decoration-none">
            +91 7320893482
          </a>
        </>
      ),
    },
    {
      Icon: Mail,
      title: "Email",
      content: (
        <>
          <a
            href="mailto:nishant805180@gmail.com"
            className="text-decoration-none"
          >
            nishant805180@gmail.com
          </a>
          <br />
          <a
            href="mailto:nishant620057@gmail.com"
            className="text-decoration-none"
          >
            nishant620057@gmail.com
          </a>
        </>
      ),
    },
  ];

  return (
    <section className="py-5 public-page">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="text-primary fw-semibold">Contact</span>
          <h1 className="mt-2">Reach the Smart City Support Desk</h1>
          <p className="text-muted">
            For urgent civic issues, use the complaint form. For portal help,
            contact the support team.
          </p>
        </div>

        <div className="row g-4">
          {contactInfo.map(({ Icon, title, content }) => (
            <div className="col-md-4" key={title}>
              <div className="public-card h-100 p-4 text-center shadow-sm rounded">
                <div className="mb-3">
                  <Icon size={36} />
                </div>

                <h2 className="h5 mb-3">{title}</h2>

                <div className="text-muted">{content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;