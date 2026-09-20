import Complaint from "../models/Complaint.js";

const findAssignedComplaint = (complaintId, officerId) => {
  return Complaint.findOne({
    _id: complaintId,
    assignedTo: officerId
  })
    .populate("createdBy", "name email mobile role")
    .populate("assignedTo", "name email mobile role department")
    .populate("timeline.updatedBy", "name role");
};

export const getAssignedComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user._id })
      .populate("createdBy", "name email mobile role")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    next(error);
  }
};

export const getOfficerComplaintDetails = async (req, res, next) => {
  try {
    const complaint = await findAssignedComplaint(req.params.id, req.user._id).select("-__v");

    if (!complaint) {
      res.status(404);
      return next(new Error("Assigned complaint not found"));
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const updateOfficerComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["In Progress", "Resolved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      return next(new Error("Officers can only set status to In Progress, Resolved, or Rejected"));
    }

    const complaint = await findAssignedComplaint(req.params.id, req.user._id);

    if (!complaint) {
      res.status(404);
      return next(new Error("Assigned complaint not found"));
    }

    complaint.status = status;
    complaint.resolvedAt = status === "Resolved" ? new Date() : null;
    complaint._timelineUpdatedBy = req.user._id;
    complaint._timelineMessage = `Officer updated status to ${status}`;
    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated",
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const addOfficerRemark = async (req, res, next) => {
  try {
    const { officerRemark } = req.body;

    if (!officerRemark || officerRemark.trim().length < 3) {
      res.status(400);
      return next(new Error("Officer remark must be at least 3 characters"));
    }

    const complaint = await findAssignedComplaint(req.params.id, req.user._id);

    if (!complaint) {
      res.status(404);
      return next(new Error("Assigned complaint not found"));
    }

    complaint.officerRemark = officerRemark.trim();
    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Officer remark added",
      complaint
    });
  } catch (error) {
    next(error);
  }
};
