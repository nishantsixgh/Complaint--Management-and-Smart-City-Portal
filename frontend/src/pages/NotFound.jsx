import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="py-5 public-page">
      <div className="container text-center">
        <div className="not-found-panel bg-white mx-auto">
          <span className="status-pill mb-3">404</span>
          <h1 className="display-6 fw-bold">Page not found</h1>
          <p className="text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
          <Link className="btn btn-primary" to="/">
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
