const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const railwayController = require("../controllers/railwayController");
const issueController = require("../controllers/issueController");
const auth = require("../middleware/auth");
const { requireAdmin } = require("../middleware/auth");
const { getDb } = require("../config/firebase");

router.use(auth);
router.use(requireAdmin);

// Student management
router.get("/students", adminController.getAllStudents);
router.get("/students/:id", adminController.getStudentById);
router.post("/students", adminController.createStudent);
router.put("/students/:id", adminController.updateStudent);
router.delete("/students/:id", adminController.deleteStudent);

// Railway Concession management
router.get("/railway", railwayController.getAllApplications);
router.put("/railway/:id/status", railwayController.updateStatus);

// Lost & Found management
router.get("/lostfound", async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection("lostfound").orderBy("createdAt", "desc").get();
    const posts = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Resolve poster info
      let posterName = data.postedByName || "Unknown";
      let posterEmail = data.postedByEmail || "";
      if (data.postedBy && !data.postedByName) {
        const userDoc = await db.collection("users").doc(data.postedBy).get();
        if (userDoc.exists) {
          posterName = userDoc.data().name;
          posterEmail = userDoc.data().email;
        }
      }
      posts.push({
        _id: doc.id,
        ...data,
        postedBy: { name: posterName, email: posterEmail },
      });
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lost & found posts" });
  }
});

router.delete("/lostfound/:id", async (req, res) => {
  try {
    const db = getDb();
    await db.collection("lostfound").doc(req.params.id).delete();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// Issues management
router.get("/issues", issueController.getAllIssues);
router.put("/issues/:id", issueController.updateIssue);

// Announcements management
router.get("/announcements", adminController.getAnnouncements);
router.post("/announcements", adminController.createAnnouncement);
router.delete("/announcements/:id", adminController.deleteAnnouncement);

// Quiz Analytics
router.get("/quiz/analytics", adminController.getQuizAnalytics);
router.get("/quiz/analytics/:studentId", adminController.getStudentQuizScores);

module.exports = router;
