// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentID,
      year,
      semester,
      weakCategories,
      weakTopics,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["student", "tutor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (role === "admin") {
  return res.status(403).json({ message: "Admin registration is not allowed" });
}

    // ✅ if student, require these
    if (role === "student") {
      if (!studentID || !studentID.trim()) {
        return res.status(400).json({ message: "Student ID is required" });
      }

      const y = Number(year);
      const s = Number(semester);

      if (![1, 2, 3, 4].includes(y) || ![1, 2].includes(s)) {
        return res.status(400).json({ message: "Invalid year/semester" });
      }

      if (!Array.isArray(weakCategories) || weakCategories.length === 0) {
        return res
          .status(400)
          .json({ message: "Select at least one weak category" });
      }
    }

    // optional: prevent duplicate studentID (only among students)
    if (role === "student") {
      const idExists = await User.findOne({
        role: "student",
        studentID: studentID.trim(),
      });
      if (idExists) {
        return res.status(400).json({ message: "Student ID already exists" });
      }
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const created = await User.create({
      name,
      email,
      password: hashed,
      role,

      // ✅ store student fields only for students
      studentID: role === "student" ? studentID.trim() : null,
      year: role === "student" ? Number(year) : null,
      semester: role === "student" ? Number(semester) : null,
      weakCategories: role === "student" ? weakCategories : [],
      weakTopics: role === "student" ? (weakTopics || []) : [],
    });

    const token = signToken(created._id);

    // password excluded by schema (select:false)
    const user = await User.findById(created._id);

    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ token, user: userObj });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};