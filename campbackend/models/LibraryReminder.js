const mongoose = require("mongoose");

const libraryReminderSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, trim: true },
    rollNumber: { type: String, trim: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Returned", "Overdue"],
      default: "Active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LibraryReminder", libraryReminderSchema);
