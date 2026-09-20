import Complaint from "../models/Complaint.js";

const populateComplaint = (query) => {
  return query
    .populate("createdBy", "name email mobile role")
    .populate("assignedTo", "name email mobile role department")
    .populate("timeline.updatedBy", "name role");
};

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, city, address, priority = "Medium" } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category,
      location,
      city,
      address,
      priority,
      imageUrl: req.file?.path || req.file?.secure_url || req.file?.url || "",
      imagePublicId: req.file?.filename || req.file?.public_id || "",
      createdBy: req.user._id
    });

    complaint._timelineUpdatedBy = req.user._id;
    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
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

export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await populateComplaint(Complaint.findById(req.params.id).select("-__v"));

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found"));
    }

    const isOwner = complaint.createdBy._id.toString() === req.user._id.toString();
    const isStaff = ["admin", "officer"].includes(req.user.role);

    if (!isOwner && !isStaff) {
      res.status(403);
      return next(new Error("You can only view your own complaints"));
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const trackComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId })
      .select(
        "title category location city status priority trackingId department adminRemark officerRemark resolvedAt createdAt"
      )
      .lean();

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found for this tracking ID"));
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};
