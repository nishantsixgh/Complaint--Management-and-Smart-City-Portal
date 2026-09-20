import { getStatusBadgeClass } from "../utils/complaintStatus.js";

const StatusBadge = ({ status }) => {
  return <span className={`badge ${getStatusBadgeClass(status)}`}>{status || "Unknown"}</span>;
};

export default StatusBadge;
