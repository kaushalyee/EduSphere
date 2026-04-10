const assignmentAnalyzer = require('./services/assignmentAnalyzer');
const fs = require('fs');
const path = require('path');

async function testBadAnalysis() {
  try {
    console.log('Testing analysis with bad content...');
    
    // Create test files with bad content
    const badRubric = `
    Assignment Requirements
    
    1. Introduction (25 marks) - Must have clear introduction
    2. Research (25 marks) - Must include citations and references
    3. Analysis (25 marks) - Must provide critical analysis
    4. Conclusion (25 marks) - Must summarize findings
    `;
    
    const badDraft = `
    This is a very short assignment.
    It doesn't have an introduction.
    No research or citations.
    No analysis provided.
    No conclusion.
    Very poor quality.
    `;
    
    // Write test files
    fs.writeFileSync('uploads/test-bad-rubric.txt', badRubric);
    fs.writeFileSync('uploads/test-bad-draft.txt', badDraft);
    
    // Run analysis
    const analysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/test-bad-rubric.txt',
      'uploads/test-bad-draft.txt'
    );
    
    console.log('Bad content analysis results:');
    console.log('Predicted grade:', analysis.predictedGrade);
    console.log('Grading breakdown:');
    analysis.gradingBreakdown.forEach((item, index) => {
      console.log(`${index + 1}. ${item.criteria}: ${item.predictedMarks}/${item.maxMarks}`);
    });
    
  } catch (error) {
    console.error('Bad analysis test failed:', error);
  }
}

testBadAnalysis();
