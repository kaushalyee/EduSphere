const assignmentAnalyzer = require('./services/assignmentAnalyzer');
const fs = require('fs');

async function debugCriteriaExtraction() {
  try {
    console.log('Debugging criteria extraction from uploaded files...');
    
    // Find the most recent uploaded files
    const files = fs.readdirSync('uploads');
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length >= 2) {
      const rubricPath = 'uploads/' + pdfFiles[pdfFiles.length - 2]; // Second to last
      const draftPath = 'uploads/' + pdfFiles[pdfFiles.length - 1]; // Last one
      
      console.log('Rubric file:', rubricPath);
      console.log('Draft file:', draftPath);
      
      // Extract text from rubric
      const rubricText = await assignmentAnalyzer.extractTextFromFile(rubricPath);
      console.log('\n=== EXTRACTED RUBRIC TEXT ===');
      console.log(rubricText.substring(0, 1000) + '...');
      console.log('Total rubric text length:', rubricText.length);
      
      // Extract criteria
      const criteria = assignmentAnalyzer.extractCriteriaFromRubric(rubricText);
      console.log('\n=== EXTRACTED CRITERIA ===');
      criteria.forEach((criterion, index) => {
        console.log(`${index + 1}. "${criterion.name}" - ${criterion.maxMarks} marks`);
        console.log(`   Keywords: ${criterion.keywords.join(', ')}`);
      });
      
      console.log('\n=== RUBRIC ANALYSIS ===');
      console.log(`Total criteria found: ${criteria.length}`);
      console.log(`Total possible marks: ${criteria.reduce((sum, c) => sum + c.maxMarks, 0)}`);
      
    } else {
      console.log('Need at least 2 PDF files in uploads directory');
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugCriteriaExtraction();
