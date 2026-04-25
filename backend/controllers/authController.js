// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require('../services/emailService');

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
    } = req.body;

    // Normalise to arrays — FormData sends a plain string when only one value is selected
    const weakCategories = req.body.weakCategories
      ? [].concat(req.body.weakCategories)
      : [];
    const weakTopics = req.body.weakTopics
      ? [].concat(req.body.weakTopics)
      : [];

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
      verificationStatus: role === 'student' ? 'pending' : 'approved',

      // ✅ store student fields only for students
      studentID: role === "student" ? studentID.trim() : null,
      year: role === "student" ? Number(year) : null,
      semester: role === "student" ? Number(semester) : null,
      weakCategories: role === "student" ? weakCategories : [],
      weakTopics: role === "student" ? (weakTopics || []) : [],
    });

    // Attach uploaded verification documents if present
    if (req.files) {
      if (req.files.studentIdPhoto) {
        created.studentIdPhoto = req.files.studentIdPhoto[0].path.replace(/\\/g, '/');
      }
      if (req.files.supportingDocument) {
        created.supportingDocument = req.files.supportingDocument[0].path.replace(/\\/g, '/');
      }
      if (req.body.documentType) {
        created.documentType = req.body.documentType;
      }
      await created.save();
    }

    const token = signToken(created._id);

    // Send verification-pending email to new students (non-blocking)
    if (created.role === 'student') {
      sendRegistrationEmail(created.email, created.name).catch((err) =>
        console.error('Registration email failed:', err.message)
      );
    }

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: created._id,
        name: created.name,
        email: created.email,
        role: created.role,
        verificationStatus: created.verificationStatus,
      },
    });
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

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.resubmitDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.files?.studentIdPhoto) {
      user.studentIdPhoto = req.files.studentIdPhoto[0].path.replace(/\\/g, '/');
    }
    if (req.files?.supportingDocument) {
      user.supportingDocument = req.files.supportingDocument[0].path.replace(/\\/g, '/');
    }
    if (req.body.documentType) {
      user.documentType = req.body.documentType;
    }
    user.verificationStatus = 'pending';
    user.rejectionReason = null;
    user.resubmissionNote = null;
    user.verificationHistory.push({
      status: 'pending',
      reason: 'Documents resubmitted by student',
      changedAt: Date.now(),
    });
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Documents resubmitted successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};