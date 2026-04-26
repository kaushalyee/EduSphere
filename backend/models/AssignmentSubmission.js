// Import mongoose library for MongoDB database operations and schema creation
const mongoose = require("mongoose");

// Create a new schema definition for assignment submissions with all required fields
const assignmentSubmissionSchema = new mongoose.Schema(
  {
    // Foreign key reference to the assignment requirement document
    requirementId: {
      type: mongoose.Schema.Types.ObjectId,  // Store as MongoDB ObjectId
      ref: "AssignmentRequirement",  // Reference to AssignmentRequirement model
      required: true,  // This field is mandatory
    },
    // Foreign key reference to the user (student) who submitted the assignment
    studentId: {
      type: mongoose.Schema.Types.ObjectId,  // Store as MongoDB ObjectId
      ref: "User",  // Reference to User model
      required: true,  // This field is mandatory
    },
    // File URL for the rubric/requirements document uploaded by student
    rubricFileUrl: {
      type: String,  // Store file path as string
      trim: true,  // Remove whitespace from beginning and end
    },
    // File URL for the student's assignment draft
    draftFileUrl: {
      type: String,  // Store file path as string
      required: true,  // This field is mandatory
      trim: true,  // Remove whitespace from beginning and end
    },
    // Fallback field for traditional single file submission (backward compatibility)
    fileUrl: {
      type: String,  // Store file path as string
      trim: true,  // Remove whitespace from beginning and end
    },
    // Status of the submission in the analysis/grading workflow
    status: {
      type: String,  // Store status as string
      enum: ["submitted", "analyzing", "graded", "late"],  // Allowed values only
      default: "submitted",  // Default status when submission is created
    },
    // Object to store automated rubric analysis results
    rubricAnalysis: {
      // Array of criteria extracted from the rubric document
      criteria: [{
        name: String,  // Name of the criterion (e.g., "Introduction")
        maxMarks: Number,  // Maximum marks for this criterion
        keywords: [String],  // Array of keywords to check in student's work
        description: String  // Description of what this criterion covers
      }],
      extractedAt: Date  // Timestamp when rubric analysis was completed
    },
    // Array containing detailed breakdown of grading for each criterion
    gradingBreakdown: [{
      criteria: String,  // Name of the criterion being graded
      maxMarks: Number,  // Maximum possible marks for this criterion
      predictedMarks: Number,  // Marks predicted by automated analysis
      checks: {  // Object containing various automated checks performed
        hasSection: Boolean,  // Whether the required section was found
        wordCount: Number,  // Number of words in that section
        keywordsFound: Number,  // Number of matching keywords found
        referencesCount: Number,  // Number of references/citations found
        formattingCorrect: Boolean  // Whether formatting requirements were met
      }
    }],
    // Object containing final grade prediction results
    predictedGrade: {
      percentage: Number,  // Overall predicted percentage score
      grade: String,  // Predicted grade letter (A, B, C, D)
      confidence: Number  // Confidence level of the prediction (0-100)
    },
    // Traditional grade field for manual grading by tutors
    grade: {
      type: Number,  // Store grade as number
      default: null,  // No grade by default
      min: 0,  // Minimum allowed grade is 0
    },
    // Feedback provided by the tutor about the submission
    tutorFeedback: {
      type: String,  // Store feedback as string
      trim: true,  // Remove whitespace from beginning and end
      default: "",  // Empty feedback by default
    },
    // Timestamp when the assignment was submitted by the student
    submittedAt: {
      type: Date,  // Store as JavaScript Date object
      default: Date.now,  // Automatically set to current time
    },
    // Timestamp when the automated analysis was completed
    analysisCompletedAt: Date,  // Store as JavaScript Date object
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

// Create database index on requirementId for faster queries by assignment
assignmentSubmissionSchema.index({ requirementId: 1 });
// Create database index on studentId for faster queries by student
assignmentSubmissionSchema.index({ studentId: 1 });

// Export the model to be used in other parts of the application
module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
