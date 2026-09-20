import mongoose from "mongoose";
import Counter from "./Counter.js";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1500, "Description cannot exceed 1500 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    imagePublicId: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
      default: "Pending"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    trackingId: {
      type: String,
      unique: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    department: {
      type: String,
      trim: true,
      default: ""
    },
    adminRemark: {
      type: String,
      trim: true,
      default: ""
    },
    officerRemark: {
      type: String,
      trim: true,
      default: ""
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    timeline: [
      {
        status: {
          type: String,
          enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
          required: true
        },
        message: {
          type: String,
          required: true,
          trim: true
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        },
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    feedback: {
      rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"]
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [700, "Feedback comment cannot exceed 700 characters"]
      },
      submittedAt: {
        type: Date
      }
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

complaintSchema.pre("validate", async function generateTrackingId(next) {
  if (this.trackingId) {
    return next();
  }

  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { _id: `complaint-${year}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.trackingId = `CMP-${year}-${100000 + counter.seq}`;
  next();
});

complaintSchema.pre("save", function addTimelineEntry(next) {
  if (this.isNew) {
    this.timeline.push({
      status: "Pending",
      message: "Complaint Submitted",
      updatedBy: this._timelineUpdatedBy || this.createdBy,
      date: new Date()
    });
    return next();
  }

  if (this.isModified("status")) {
    this.timeline.push({
      status: this.status,
      message: this._timelineMessage || `Status updated to ${this.status}`,
      updatedBy: this._timelineUpdatedBy || null,
      date: new Date()
    });
  }

  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
