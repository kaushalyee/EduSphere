const assignmentAnalyzer = require('./services/assignmentAnalyzer');
const path = require('path');

async function testAnalyzer() {
  try {
    console.log('Testing assignment analyzer...');
    
    // Test with the uploaded files
    const rubricPath = path.join(__dirname, 'uploads', 'test-rubric.txt');
    const draftPath = path.join(__dirname, 'uploads', 'test-draft.txt');
    
    console.log('Testing with files:', { rubricPath, draftPath });
    
    // Check if files exist
    const fs = require('fs');
    if (!fs.existsSync(rubricPath)) {
      console.log('Rubric file not found, creating test file...');
      fs.writeFileSync(rubricPath, 'Test rubric content for analysis');
    }
    
    if (!fs.existsSync(draftPath)) {
      console.log('Draft file not found, creating test file...');
      fs.writeFileSync(draftPath, 'Test draft content for analysis');
    }
    
    // Run analysis
    const analysis = await assignmentAnalyzer.analyzeSubmission(rubricPath, draftPath);
    
    console.log('Analysis completed successfully!');
    console.log('Results:', JSON.stringify(analysis, null, 2));
    
  } catch (error) {
    console.error('Analyzer test failed:', error);
    console.error('Error stack:', error.stack);
  }
}

testAnalyzer();
