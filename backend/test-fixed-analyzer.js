const assignmentAnalyzer = require('./services/assignmentAnalyzerFixed');
const fs = require('fs');

async function testFixedAnalyzer() {
  try {
    console.log('=== TESTING FIXED ANALYZER ===\n');
    
    // Test 1: Your actual uploaded files
    console.log('1. Testing with your uploaded files...');
    const files = fs.readdirSync('uploads');
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length >= 2) {
      const rubricPath = 'uploads/' + pdfFiles[pdfFiles.length - 2];
      const draftPath = 'uploads/' + pdfFiles[pdfFiles.length - 1];
      
      console.log('Rubric:', rubricPath);
      console.log('Draft:', draftPath);
      
      const analysis = await assignmentAnalyzer.analyzeSubmission(rubricPath, draftPath);
      
      console.log('\n=== FIXED ANALYSIS RESULTS ===');
      console.log('Grade:', analysis.predictedGrade.grade);
      console.log('Percentage:', analysis.predictedGrade.percentage + '%');
      console.log('Confidence:', analysis.predictedGrade.confidence + '%');
      console.log('Total Marks:', analysis.predictedGrade.totalMarks);
      console.log('Earned Marks:', analysis.predictedGrade.earnedMarks);
      
      console.log('\n=== DETAILED BREAKDOWN ===');
      analysis.gradingBreakdown.forEach((item, index) => {
        const percentage = Math.round((item.predictedMarks / item.maxMarks) * 100);
        console.log(`${index + 1}. ${item.criteria}:`);
        console.log(`   Marks: ${item.predictedMarks}/${item.maxMarks} (${percentage}%)`);
        console.log(`   Feedback: ${item.feedback}`);
      });
      
    } else {
      console.log('Need at least 2 PDF files for testing');
    }
    
    // Test 2: Test with bad content
    console.log('\n\n2. Testing with bad content...');
    const badRubric = `
    This is just a regular assignment document.
    It doesn't have any specific grading criteria.
    Just some random text about the assignment.
    `;
    
    const badDraft = `
    This is a very poor assignment.
    It has no structure.
    No research or evidence.
    Very short and incomplete.
    `;
    
    // Write test files
    fs.writeFileSync('uploads/test-bad-rubric.txt', badRubric);
    fs.writeFileSync('uploads/test-bad-draft.txt', badDraft);
    
    const badAnalysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/test-bad-rubric.txt',
      'uploads/test-bad-draft.txt'
    );
    
    console.log('Bad content grade:', badAnalysis.predictedGrade.grade);
    console.log('Bad content percentage:', badAnalysis.predictedGrade.percentage + '%');
    
    // Test 3: Test with good content
    console.log('\n\n3. Testing with good content...');
    const goodRubric = `
    Assignment Rubric:
    Introduction: 25 marks
    Research: 25 marks
    Analysis: 25 marks
    Conclusion: 25 marks
    `;
    
    const goodDraft = `
    Introduction:
    This assignment provides a comprehensive introduction to the topic with clear objectives and scope.
    
    Research:
    Extensive research has been conducted using multiple academic sources and peer-reviewed journals.
    All references are properly cited using APA format.
    
    Analysis:
    Critical analysis demonstrates deep understanding of the subject matter.
    Multiple perspectives are considered and evaluated thoroughly.
    
    Conclusion:
    The conclusion effectively summarizes key findings and provides thoughtful recommendations.
    `;
    
    fs.writeFileSync('uploads/test-good-rubric.txt', goodRubric);
    fs.writeFileSync('uploads/test-good-draft.txt', goodDraft);
    
    const goodAnalysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/test-good-rubric.txt',
      'uploads/test-good-draft.txt'
    );
    
    console.log('Good content grade:', goodAnalysis.predictedGrade.grade);
    console.log('Good content percentage:', goodAnalysis.predictedGrade.percentage + '%');
    
    console.log('\n=== TEST COMPLETE ===');
    console.log('The fixed analyzer should now give realistic grades!');
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Error details:', error.message);
  }
}

testFixedAnalyzer();
