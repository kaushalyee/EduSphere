const xlsx = require("xlsx");
const fs = require("fs");
const mongoose = require("mongoose");

const User = require("../models/User");
const Session = require("../models/Session");
const QuizResult = require("../models/QuizResult");

const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// POST /api/quiz-results/import/:sessionId
const importQuizResults = async (req, res) => {
  const { sessionId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No Excel file uploaded",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      deleteFileIfExists(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid session ID",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      deleteFileIfExists(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status !== "completed") {
      deleteFileIfExists(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Quiz results can only be uploaded for completed sessions",
      });
    }

    // only session owner tutor can upload results
    if (session.tutorId.toString() !== req.user._id.toString()) {
      deleteFileIfExists(req.file.path);
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload results for this session",
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const firstRow = rows[0] || {};
    const headers = Object.keys(firstRow).map((key) => key.trim());

    const requiredHeaders = ["Email", "Marks", "Total"];
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      deleteFileIfExists(req.file.path);
      return res.status(400).json({
        success: false,
        message: `Missing required Excel columns: ${missingHeaders.join(", ")}`,
      });
    }
    if (!rows || rows.length === 0) {
      deleteFileIfExists(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }

    const savedResults = [];
    const skippedDetails = [];

    for (const row of rows) {
      const normalizedRow = {};
      for (const key in row) {
        normalizedRow[key.trim()] = row[key];
      }

      const email = normalizedRow["Email"];
      const marksValue = normalizedRow["Marks"];
      const totalValue = normalizedRow["Total"];

      if (!email || marksValue === undefined || totalValue === undefined) {
        skippedDetails.push({
          row,
          reason: "Missing required columns: Email, Marks, or Total",
        });
        continue;
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const marksObtained = Number(marksValue);
      const totalMarks = Number(totalValue);

      if (Number.isNaN(marksObtained) || Number.isNaN(totalMarks)) {
        skippedDetails.push({
          email: normalizedEmail,
          reason: "Marks or Total must be valid numbers",
        });
        continue;
      }

      if (marksObtained < 0) {
        skippedDetails.push({
          email: normalizedEmail,
          reason: "Marks cannot be negative",
        });
        continue;
      }

      if (totalMarks <= 0) {
        skippedDetails.push({
          email: normalizedEmail,
          reason: "Total marks must be greater than 0",
        });
        continue;
      }

      if (marksObtained > totalMarks) {
        skippedDetails.push({
          email: normalizedEmail,
          reason: "Marks cannot be greater than total marks",
        });
        continue;
      }

      const student = await User.findOne({
        email: normalizedEmail,
        role: "student",
      });

      if (!student) {
        skippedDetails.push({
          email: normalizedEmail,
          reason: "Student not found",
        });
        continue;
      }

      const percentage = Number(
        ((marksObtained / totalMarks) * 100).toFixed(2)
      );

      const saved = await QuizResult.findOneAndUpdate(
        {
          sessionId: session._id,
          studentId: student._id,
        },
        {
          sessionId: session._id,
          studentId: student._id,
          studentEmail: student.email,
          marksObtained,
          totalMarks,
          percentage,
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      savedResults.push(saved);
    }


    deleteFileIfExists(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Quiz results imported successfully",
      totalRows: rows.length,
      savedCount: savedResults.length,
      skippedCount: skippedDetails.length,
      savedResults,
      skippedDetails,
    });
  } catch (error) {
    if (req.file) {
      deleteFileIfExists(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to import quiz results",
      error: error.message,
    });
  }
};

// GET /api/quiz-results/session/:sessionId
const getResultsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (
      req.user.role === "tutor" &&
      session.tutorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view results for this session",
      });
    }

    const results = await QuizResult.find({ sessionId })
      .populate("studentId", "name email studentID")
      .sort({ percentage: -1, marksObtained: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session results",
      error: error.message,
    });
  }
};

// GET /api/quiz-results/student/:studentId
const getResultsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (
      req.user.role === "student" &&
      req.user._id.toString() !== studentId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these results",
      });
    }

    const results = await QuizResult.find({ studentId })
      .populate("sessionId", "topic category date time")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student results",
      error: error.message,
    });
  }
};
const getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ studentId: req.user._id })
      .populate("sessionId", "topic category date time")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your results",
      error: error.message,
    });
  }
};

module.exports = {
  importQuizResults,
  getResultsBySession,
  getResultsByStudent,
  getMyResults,
};