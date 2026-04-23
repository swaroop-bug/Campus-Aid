const express = require("express");
const railwayController = require("../controllers/railwayController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Student routes (protected)
router.post("/apply", authMiddleware, railwayController.applyForConcession);
router.get("/my", authMiddleware, railwayController.getMyApplications);
router.delete("/:id", authMiddleware, railwayController.cancelApplication);

// Admin routes (protected)
router.get("/all", authMiddleware, railwayController.getAllApplications);
router.put("/:id/status", authMiddleware, railwayController.updateStatus);

module.exports = router;
