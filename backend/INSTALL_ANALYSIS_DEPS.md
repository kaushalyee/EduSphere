# Assignment Analysis System Installation

## Backend Dependencies

Install the required packages for PDF processing and file handling:

```bash
cd backend
npm install pdf-parse multer
```

## Required Dependencies

1. **pdf-parse** - For extracting text from PDF files
   - Used to read rubric and assignment content from PDFs
   - Version: ^1.1.1 or later

2. **multer** - Already installed, used for file uploads
   - Handles multipart/form-data for file uploads

## Optional Dependencies (for enhanced functionality)

For better Word document support, consider installing:

```bash
npm install mammoth
```

And update the `extractTextFromWord` function in `services/assignmentAnalyzer.js`:

```javascript
const mammoth = require('mammoth');

async extractTextFromWord(filePath) {
  try {
    const result = await mammoth.extractRawText({path: filePath});
    return result.value;
  } catch (error) {
    console.error('Error reading Word file:', error);
    throw new Error('Failed to read Word file');
  }
}
```

## Frontend Dependencies

Install React Dropzone for better file upload experience:

```bash
cd frontend
npm install react-dropzone
```

## File Structure After Setup

```
backend/
├── services/
│   └── assignmentAnalyzer.js     # Core analysis logic
├── models/
│   └── AssignmentSubmission.js   # Enhanced with analysis fields
├── controllers/
│   └── assignmentController.js  # New analysis endpoints
└── routes/
    └── assignmentRoutes.js      # New analysis routes

frontend/
└── src/components/assignments/
    └── AssignmentSubmissionWithRubric.jsx  # Enhanced submission UI
```

## How It Works

1. **Student uploads rubric + draft** → Files stored in `/uploads/`
2. **System extracts text** from both files using pdf-parse
3. **Rubric analysis** extracts criteria and marks using regex patterns
4. **Draft analysis** checks each criterion against student's work
5. **Automated scoring** calculates predicted marks per section
6. **Grade prediction** provides overall grade with confidence level
7. **Tutor override** allows manual grade adjustment if needed

## API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/assignments/submit-with-rubric` | Submit with rubric analysis |
| GET | `/api/assignments/:id/analysis` | Get analysis results |
| POST | `/api/assignments/:id/override-grade` | Tutor override grade |

## Testing the System

1. Start your backend server
2. Navigate to an assignment page
3. Use the new `AssignmentSubmissionWithRubric` component
4. Upload both rubric (requirements) and draft files
5. Watch the real-time analysis progress
6. View detailed grading breakdown

## Grade Prediction Logic

- **85-100%**: A - Distinction
- **70-84%**: B - Merit  
- **55-69%**: C - Pass
- **Below 55%**: D - Needs Improvement

Each criterion is scored based on:
- Section presence (40%)
- Word count adequacy (30%)
- Keyword matching (20%)
- References/formatting (10%)
