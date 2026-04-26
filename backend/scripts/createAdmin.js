require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@edusphere.com";
    const password = "Admin123"; // you can change this

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name: "System Admin",
      email,
      password: hashed,
      role: "admin"
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

createAdmin();