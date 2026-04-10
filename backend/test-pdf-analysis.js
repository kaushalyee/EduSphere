const assignmentAnalyzer = require('./services/assignmentAnalyzer');
const fs = require('fs');
const path = require('path');

async function testPDFAnalysis() {
  try {
    console.log('Testing PDF analysis with uploaded files...');
    
    // List all files in uploads directory
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    console.log('Files in uploads directory:', files);
    
    // Find the most recent PDF files
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    console.log('PDF files found:', pdfFiles);
    
    if (pdfFiles.length < 2) {
      console.log('Need at least 2 PDF files for testing');
      return;
    }
    
    // Use the first two PDF files
    const rubricPath = path.join(uploadsDir, pdfFiles[0]);
    const draftPath = path.join(uploadsDir, pdfFiles[1]);
    
    console.log('Testing with:');
    console.log('Rubric:', rubricPath);
    console.log('Draft:', draftPath);
    
    // Run analysis
    const analysis = await assignmentAnalyzer.analyzeSubmission(rubricPath, draftPath);
    
    console.log('PDF Analysis completed successfully!');
    console.log('Results:', JSON.stringify(analysis, null, 2));
    
  } catch (error) {
    console.error('PDF Analysis test failed:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testPDFAnalysis();
