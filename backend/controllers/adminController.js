import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { deleteCloudinaryImage } from "../config/cloudinary.js";

const buildComplaintFilters = (query) => {
  const filters = {};
  const { status, category, priority, city, date } = query;

  if (status) filters.status = status;
  if (category) filters.category = category;
  if (priority) filters.priority = priority;
  if (city) {
    const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.city = new RegExp(`^${escapedCity}$`, "i");
  }
  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    filters.createdAt = { $gte: start, $lte: end };
  }

  return filters;
};

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [
      totalComplaints,
      pending,
      assigned,
      inProgress,
      resolved,
      rejected,
      totalUsers,
      totalOfficers
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "Assigned" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.countDocuments({ status: "Rejected" }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "officer" })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pending,
        assigned,
        inProgress,
        resolved,
        rejected,
        totalUsers,
        totalOfficers
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find(buildComplaintFilters(req.query))
      .populate("createdBy", "name email mobile role")
      .populate("assignedTo", "name email mobile role department")
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

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, adminRemark = "" } = req.body;
    const allowedStatuses = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      return next(new Error("Invalid complaint status"));
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found"));
    }

    complaint.status = status;
    complaint.adminRemark = adminRemark;
    complaint.resolvedAt = status === "Resolved" ? new Date() : null;
    complaint._timelineUpdatedBy = req.user._id;
    complaint._timelineMessage = `Admin updated status to ${status}`;
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

export const assignComplaintToOfficer = async (req, res, next) => {
  try {
    const { officerId, department = "", adminRemark = "" } = req.body;
    const officer = await User.findOne({ _id: officerId, role: "officer" }).select("-password");

    if (!officer) {
      res.status(404);
      return next(new Error("Officer not found"));
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found"));
    }

    complaint.assignedTo = officer._id;
    complaint.department = department || officer.department;
    complaint.adminRemark = adminRemark;
    complaint.status = "Assigned";
    complaint._timelineUpdatedBy = req.user._id;
    complaint._timelineMessage = `Assigned to ${officer.name}`;
    await complaint.save();
    await complaint.populate("createdBy", "name email mobile role");
    await complaint.populate("assignedTo", "name email mobile role department");

    res.status(200).json({
      success: true,
      message: "Complaint assigned to officer",
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      return next(new Error("Complaint not found"));
    }

    if (complaint.imagePublicId) {
      await deleteCloudinaryImage(complaint.imagePublicId);
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const createUserByAdmin = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role = "user", department = "" } = req.body;
    const allowedRoles = ["user", "admin", "officer"];

    if (!allowedRoles.includes(role)) {
      res.status(400);
      return next(new Error("Invalid user role"));
    }

    if (role === "officer" && !department.trim()) {
      res.status(400);
      return next(new Error("Department is required for officers"));
    }

    const userExists = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (userExists) {
      res.status(400);
      return next(new Error("User with this email or mobile already exists"));
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role,
      department: role === "officer" ? department : ""
    });

    const safeUser = await User.findById(user._id).select("-password");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

export const blockUnblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    if (user.role === "admin") {
      res.status(400);
      return next(new Error("Admin users cannot be blocked"));
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryAnalytics = async (_req, res, next) => {
  try {
    const analytics = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    next(error);
  }
};

export const getStatusAnalytics = async (_req, res, next) => {
  try {
    const analytics = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyAnalytics = async (_req, res, next) => {
  try {
    const analytics = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" }
                ]
              }
            ]
          },
          count: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    next(error);
  }
};
