import { Link } from "react-router-dom";
import PriorityBadge from "./PriorityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";

const ComplaintCard = ({ complaint, to }) => {
  return (
    <div className="complaint-card bg-white p-4">
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
        <span className="fw-semibold text-primary">{complaint.trackingId}</span>
        <div className="d-flex gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>
      <h2 className="h5 fw-semibold">{complaint.title}</h2>
      <p className="text-muted small mb-3">
        {complaint.category} • {complaint.city}
      </p>
      <Link className="btn btn-sm btn-outline-primary" to={to}>
        View Details
      </Link>
    </div>
  );
};

export default ComplaintCard;
