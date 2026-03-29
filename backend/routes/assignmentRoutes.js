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
  getTutorAssignments
} = require('../controllers/assignmentController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
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

// Route to submit assignment
router.post('/submit', submitAssignment);

console.log(">>> REGISTERED ASSIGNMENT ROUTES:", router.stack.map(r => r.route.path));

module.exports = router;
