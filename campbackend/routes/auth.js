const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// registration endpoint temporarily enabled for admin creation
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profile routes (protected)
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
