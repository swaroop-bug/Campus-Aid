const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDb } = require("../config/firebase");

// Public route: get announcements (for student dashboard)
router.get("/announcements", auth, async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection("announcements").orderBy("createdAt", "desc").get();
    const announcements = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements", error: error.message });
  }
});

module.exports = router;
