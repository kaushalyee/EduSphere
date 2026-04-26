const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create a simple test app
const app = express();
app.use(express.json());

// Configure multer for file uploads
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
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Test endpoint
app.post('/test-upload', upload.fields([
  { name: 'rubricFile', maxCount: 1 },
  { name: 'draftFile', maxCount: 1 }
]), (req, res) => {
  try {
    console.log('Test upload received:');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    res.status(200).json({
      success: true,
      message: 'Test upload successful',
      data: {
        requirementId: req.body.requirementId,
        studentId: req.body.studentId,
        rubricFile: req.files.rubricFile ? req.files.rubricFile[0].filename : null,
        draftFile: req.files.draftFile ? req.files.draftFile[0].filename : null
      }
    });
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Test upload failed',
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test-upload`);
});
