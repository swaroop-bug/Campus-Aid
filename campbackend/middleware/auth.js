const jwt = require("jsonwebtoken");
const { getDb } = require("../config/firebase");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDb();
    const userDoc = await db.collection("users").doc(decoded.id).get();

    if (!userDoc.exists) {
      return res.status(401).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    // Expose user info in a backward-compatible way
    req.user = { _id: userDoc.id, id: userDoc.id, ...userData };
    req.userId = userDoc.id;
    req.role = userData.role;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin role required." });
  }
  next();
};

const requireStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "Access denied. Student role required." });
  }
  next();
};

module.exports = authMiddleware;
module.exports.requireAdmin = requireAdmin;
module.exports.requireStudent = requireStudent;
