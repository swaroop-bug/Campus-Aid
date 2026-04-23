require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function migratePasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas\n");

    const users = await User.find({});
    console.log(`Found ${users.length} users to check...\n`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      // bcrypt hashes always start with $2a$ or $2b$
      const isAlreadyHashed = user.password && user.password.startsWith("$2");

      if (isAlreadyHashed) {
        console.log(`⏭  Skipped (already hashed): ${user.email}`);
        skipped++;
      } else {
        // Plain text — hash it directly (bypass pre-save hook using updateOne)
        const hashed = await bcrypt.hash(user.password, 10);
        await User.updateOne({ _id: user._id }, { password: hashed });
        console.log(`✅ Migrated: ${user.email}`);
        migrated++;
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ Migrated : ${migrated} users`);
    console.log(`⏭  Skipped  : ${skipped} users (already hashed)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("All students can now log in with their original passwords.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

migratePasswords();
