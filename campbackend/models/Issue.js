const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Technical", "Academic", "Administrative", "Infrastructure", "Other"],
      default: "Other",
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporterName: { type: String, trim: true },
    reporterEmail: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    adminResponse: { type: String, default: "" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
