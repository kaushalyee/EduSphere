const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getStudentAssignments,
  analyzeSubmission,
  submitAssignment,
  getAssignmentDetails,
  getStudentSubmissions,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getTutorAssignments,
  submitAssignmentWithRubric,
  getSubmissionAnalysis,
  overrideGrade
} = require('../controllers/assignmentController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure uploads directory exists
    const fs = require('fs');
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter: function (req, file, cb) {
    // Define allowed file types
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

console.log(">>> REGISTERING ASSIGNMENT ROUTES <<<");

// READ Operations
// Route to get all assignments for a student
router.get('/student/:studentId', getStudentAssignments);

// Route to get assignment details
router.get('/:assignmentId/details', getAssignmentDetails);

// Route to get all submissions for a student
router.get('/student/:studentId/submissions', getStudentSubmissions);

// Route to get all assignments for a tutor
router.get('/tutor/:tutorId', getTutorAssignments);

// CREATE Operation
// Route to create a new assignment
router.post('/', createAssignment);

// UPDATE Operation
// Route to update an assignment
router.put('/:id', updateAssignment);

// DELETE Operation
// Route to delete an assignment
router.delete('/:id', deleteAssignment);

// Special Operations
// Route to analyze assignment submission (file upload)
router.post('/analyze-submission', upload.fields([
  { name: 'requirementsFile', maxCount: 1 },
  { name: 'draftFile', maxCount: 1 }
]), analyzeSubmission);

// Enhanced submission with rubric analysis
router.post('/submit-with-rubric', upload.fields([
  { name: 'rubricFile', maxCount: 1 },
  { name: 'draftFile', maxCount: 1 }
]), submitAssignmentWithRubric);

// Route to submit assignment
router.post('/submit', submitAssignment);

// Analysis and override operations
router.get('/:submissionId/analysis', getSubmissionAnalysis);
router.post('/:submissionId/override-grade', overrideGrade);

console.log(">>> REGISTERED ASSIGNMENT ROUTES:", router.stack.map(r => r.route.path));

module.exports = router;
