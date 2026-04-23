require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN = {
  name: "Campus Admin",
  email: "admin@somaiya.edu",
  password: "Admin@123",
  role: "admin",
};

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      // Reset password and ensure admin role
      // Setting password will trigger the pre('save') hook to re-hash it
      existing.role = "admin";
      existing.password = ADMIN.password;
      await existing.save();
      console.log("\n✅ Admin password reset successfully!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 Email   :", ADMIN.email);
      console.log("🔑 Password:", ADMIN.password);
      console.log("👤 Role    : admin");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      process.exit(0);
    }

    // Do NOT manually hash — the User model's pre('save') hook handles hashing
    const admin = new User({
      name: ADMIN.name,
      email: ADMIN.email,
      password: ADMIN.password,
      role: "admin",
    });
    await admin.save();

    console.log("\n🎉 Admin user created successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email   :", ADMIN.email);
    console.log("🔑 Password:", ADMIN.password);
    console.log("👤 Role    : admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
