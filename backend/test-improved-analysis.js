const assignmentAnalyzer = require('./services/assignmentAnalyzer');
const fs = require('fs');

async function testImprovedAnalysis() {
  try {
    console.log('Testing improved analysis with your uploaded files...');
    
    // Use the most recent uploaded files
    const files = fs.readdirSync('uploads');
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length >= 2) {
      const rubricPath = 'uploads/' + pdfFiles[pdfFiles.length - 2];
      const draftPath = 'uploads/' + pdfFiles[pdfFiles.length - 1];
      
      console.log('Rubric:', rubricPath);
      console.log('Draft:', draftPath);
      
      // Run full analysis
      const analysis = await assignmentAnalyzer.analyzeSubmission(rubricPath, draftPath);
      
      console.log('\n=== IMPROVED ANALYSIS RESULTS ===');
      console.log('Predicted Grade:', analysis.predictedGrade);
      console.log('Total Possible Marks:', analysis.gradingBreakdown.reduce((sum, c) => sum + c.maxMarks, 0));
      console.log('Total Earned Marks:', analysis.gradingBreakdown.reduce((sum, c) => sum + c.predictedMarks, 0));
      
      console.log('\n=== DETAILED BREAKDOWN ===');
      analysis.gradingBreakdown.forEach((item, index) => {
        const percentage = Math.round((item.predictedMarks / item.maxMarks) * 100);
        console.log(`${index + 1}. ${item.criteria}:`);
        console.log(`   Marks: ${item.predictedMarks}/${item.maxMarks} (${percentage}%)`);
        console.log(`   Keywords found: ${item.checks.keywordsFound}`);
        console.log(`   Has section: ${item.checks.hasSection}`);
      });
      
    } else {
      console.log('Need at least 2 PDF files');
    }
    
  } catch (error) {
    console.error('Improved analysis test failed:', error);
  }
}

testImprovedAnalysis();
