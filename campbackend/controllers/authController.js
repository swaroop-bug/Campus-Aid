const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getDb } = require("../config/firebase");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Registration (for admin creation or if re-enabled)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email.toLowerCase().endsWith("@somaiya.edu")) {
      return res
        .status(400)
        .json({ message: "Email must be a @somaiya.edu address" });
    }

    const db = getDb();
    // Check if user already exists
    const existing = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!existing.empty) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      createdAt: new Date().toISOString(),
    });

    const token = generateToken(userRef.id);
    res.status(201).json({
      token,
      user: { id: userRef.id, name, role: role || "student" },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'CS',
      createdAt: user.createdAt,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const db = getDb();
    await db.collection("users").doc(req.user._id).update({
      name: name.trim(),
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: req.user._id,
        name: name.trim(),
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.toLowerCase().endsWith("@somaiya.edu")) {
      return res
        .status(400)
        .json({ message: "Email must be a @somaiya.edu address" });
    }

    const db = getDb();
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ message: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Validate password
    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(userDoc.id);
    res.json({
      token,
      user: { id: userDoc.id, name: userData.name, role: userData.role, department: userData.department || 'CS' },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
