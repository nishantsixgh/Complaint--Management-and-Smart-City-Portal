import { getPriorityBadgeClass } from "../utils/complaintStatus.js";

const PriorityBadge = ({ priority }) => {
  return <span className={`badge ${getPriorityBadgeClass(priority)}`}>{priority || "Medium"}</span>;
};

export default PriorityBadge;
