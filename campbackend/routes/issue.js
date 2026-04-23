const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const issueController = require("../controllers/issueController");

// Student routes
router.post("/", authMiddleware, issueController.reportIssue);
router.get("/my", authMiddleware, issueController.getMyIssues);

module.exports = router;
