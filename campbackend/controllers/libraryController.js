const LibraryReminder = require("../models/LibraryReminder");

// Admin: Get all reminders
exports.getAll = async (req, res) => {
  try {
    const reminders = await LibraryReminder.find().sort({ dueDate: 1 });
    // Auto-mark overdue
    const today = new Date();
    for (const r of reminders) {
      if (r.status === "Active" && new Date(r.dueDate) < today) {
        r.status = "Overdue";
        await r.save();
      }
    }
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reminders", error: error.message });
  }
};

// Admin: Create reminder
exports.create = async (req, res) => {
  try {
    const { bookName, studentName, studentEmail, rollNumber, issueDate, dueDate } = req.body;
    const reminder = new LibraryReminder({
      bookName, studentName, studentEmail, rollNumber, issueDate, dueDate,
      createdBy: req.user._id,
    });
    await reminder.save();
    res.status(201).json({ message: "Reminder created successfully", reminder });
  } catch (error) {
    res.status(500).json({ message: "Failed to create reminder", error: error.message });
  }
};

// Admin: Update reminder status
exports.updateStatus = async (req, res) => {
  try {
    const reminder = await LibraryReminder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Status updated", reminder });
  } catch (error) {
    res.status(500).json({ message: "Failed to update reminder", error: error.message });
  }
};

// Admin: Delete reminder
exports.remove = async (req, res) => {
  try {
    await LibraryReminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reminder", error: error.message });
  }
};
