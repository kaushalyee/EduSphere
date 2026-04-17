const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Connect to MongoDB (simplified)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Simple submission schema for testing
const TestSubmission = new mongoose.Schema({
  requirementId: String,
  studentId: String,
  rubricFileUrl: String,
  draftFileUrl: String,
  status: String,
  submittedAt: { type: Date, default: Date.now }
});

const TestSubmissionModel = mongoose.model('TestSubmission', TestSubmission);

const app = express();
app.use(express.json());

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Debug submission endpoint
app.post('/debug-submit', upload.fields([
  { name: 'rubricFile', maxCount: 1 },
  { name: 'draftFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('=== DEBUG SUBMISSION START ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { requirementId, studentId } = req.body;
    const files = req.files;
    
    // Basic validation
    if (!files || !files.rubricFile || !files.draftFile) {
      return res.status(400).json({
        success: false,
        message: "Both rubric and draft files are required"
      });
    }
    
    // Create simple submission record
    const submission = new TestSubmissionModel({
      requirementId: requirementId || 'debug-test-id',
      studentId: studentId || 'debug-student-id',
      rubricFileUrl: `/uploads/${files.rubricFile[0].filename}`,
      draftFileUrl: `/uploads/${files.draftFile[0].filename}`,
      status: 'submitted'
    });
    
    await submission.save();
    console.log('Debug submission saved:', submission._id);
    
    res.status(201).json({
      success: true,
      message: "Debug submission successful",
      submission: submission
    });
    
  } catch (error) {
    console.error('Debug submission error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: "Debug submission failed",
      error: error.message,
      stack: error.stack
    });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
  console.log(`Debug endpoint: http://localhost:${PORT}/debug-submit`);
});
