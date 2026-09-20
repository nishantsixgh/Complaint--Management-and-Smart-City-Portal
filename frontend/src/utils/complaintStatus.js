export const getStatusBadgeClass = (status) => {
  const classes = {
    Pending: "text-bg-warning",
    Assigned: "text-bg-info",
    "In Progress": "text-bg-primary",
    Resolved: "text-bg-success",
    Rejected: "text-bg-danger"
  };

  return classes[status] || "text-bg-secondary";
};

export const getPriorityBadgeClass = (priority) => {
  const classes = {
    Low: "text-bg-success",
    Medium: "text-bg-warning",
    High: "text-bg-danger"
  };

  return classes[priority] || "text-bg-secondary";
};
