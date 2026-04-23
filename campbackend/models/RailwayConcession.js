const mongoose = require("mongoose");

const railwayConcessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    yearOfStudy: {
      type: String,
      required: true,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },
    fromStation: { type: String, required: true, trim: true },
    toStation: { type: String, required: true, trim: true },
    trainClass: {
      type: String,
      required: true,
      enum: ["Second Class", "Sleeper Class", "First Class"],
    },
    concessionType: {
      type: String,
      required: true,
      enum: ["Quarterly", "Half-Yearly", "Annual"],
    },
    purpose: {
      type: String,
      required: true,
      enum: ["Education", "Home Visit"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RailwayConcession", railwayConcessionSchema);
