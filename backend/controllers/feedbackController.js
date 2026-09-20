import Complaint from "../models/Complaint.js";

export const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment = "" } = req.body;
    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400);
      return next(new Error("Rating must be an integer between 1 and 5"));
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found"));
    }

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error("Only the complaint owner can submit feedback"));
    }

    if (complaint.status !== "Resolved") {
      res.status(400);
      return next(new Error("Feedback can be submitted only after complaint is resolved"));
    }

    if (complaint.feedback?.submittedAt) {
      res.status(400);
      return next(new Error("Feedback has already been submitted for this complaint"));
    }

    complaint.feedback = {
      rating: numericRating,
      comment,
      submittedAt: new Date()
    };

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: complaint.feedback
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintFeedback = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).select("createdBy feedback");

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found"));
    }

    const isOwner = complaint.createdBy.toString() === req.user._id.toString();
    const isStaff = ["admin", "officer"].includes(req.user.role);

    if (!isOwner && !isStaff) {
      res.status(403);
      return next(new Error("You do not have permission to view this feedback"));
    }

    res.status(200).json({
      success: true,
      feedback: complaint.feedback?.submittedAt ? complaint.feedback : null
    });
  } catch (error) {
    next(error);
  }
};
