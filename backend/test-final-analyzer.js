const assignmentAnalyzer = require('./services/assignmentAnalyzerFinal');
const fs = require('fs');

async function testFinalAnalyzer() {
  try {
    console.log('=== TESTING FINAL ANALYZER ===\n');
    
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
      
      console.log('\n=== FINAL ANALYSIS RESULTS ===');
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
        console.log(`   Word count: ${item.checks.wordCount}, Sentences: ${item.checks.sentences}`);
      });
      
      // Check if the grade is realistic
      const percentage = analysis.predictedGrade.percentage;
      console.log('\n=== GRADE REALISM CHECK ===');
      if (percentage >= 85) {
        console.log('Grade A - This should only happen for excellent content');
      } else if (percentage >= 75) {
        console.log('Grade B - This should happen for good content');
      } else if (percentage >= 65) {
        console.log('Grade C - This should happen for average content');
      } else if (percentage >= 55) {
        console.log('Grade D - This should happen for poor content');
      } else {
        console.log('Grade F - This should happen for very poor content');
      }
      
    } else {
      console.log('Need at least 2 PDF files for testing');
    }
    
    // Test 2: Test with very poor content
    console.log('\n\n2. Testing with VERY POOR content...');
    const veryPoorRubric = `
    Assignment Requirements
    This is a basic assignment.
    `;
    
    const veryPoorDraft = `
    Bad.
    Very bad.
    No content.
    `;
    
    fs.writeFileSync('uploads/very-poor-rubric.txt', veryPoorRubric);
    fs.writeFileSync('uploads/very-poor-draft.txt', veryPoorDraft);
    
    const veryPoorAnalysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/very-poor-rubric.txt',
      'uploads/very-poor-draft.txt'
    );
    
    console.log('Very Poor Content Results:');
    console.log('Grade:', veryPoorAnalysis.predictedGrade.grade);
    console.log('Percentage:', veryPoorAnalysis.predictedGrade.percentage + '%');
    
    // Test 3: Test with excellent content
    console.log('\n\n3. Testing with EXCELLENT content...');
    const excellentRubric = `
    Assignment Requirements
    High quality work expected.
    `;
    
    const excellentDraft = `
    Introduction:
    This assignment provides a comprehensive introduction to the topic with clear objectives and scope. The introduction establishes the context and significance of the study while outlining the research questions that will be addressed.
    
    Content Quality:
    The content demonstrates exceptional depth and substance. Extensive research has been conducted using multiple academic sources and peer-reviewed journals. All references are properly cited using APA format. The analysis shows critical thinking and original insights into the subject matter.
    
    Structure and Organization:
    The assignment is exceptionally well-structured with clear logical flow. Each section transitions smoothly to the next, and the organization enhances readability and comprehension. The formatting follows academic standards consistently throughout.
    
    Research and Evidence:
    Comprehensive research is evident with over 15 scholarly sources consulted. The evidence presented is relevant, current, and effectively supports all arguments. Both primary and secondary sources are utilized appropriately.
    
    Writing Style:
    The writing style is sophisticated and professional. Grammar, punctuation, and spelling are flawless. The language is clear, concise, and academic. Complex ideas are expressed with precision and elegance.
    
    Conclusion:
    The conclusion effectively synthesizes all key findings and provides thoughtful recommendations for future research. It demonstrates mastery of the subject and contributes new insights to the field.
    `;
    
    fs.writeFileSync('uploads/excellent-rubric.txt', excellentRubric);
    fs.writeFileSync('uploads/excellent-draft.txt', excellentDraft);
    
    const excellentAnalysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/excellent-rubric.txt',
      'uploads/excellent-draft.txt'
    );
    
    console.log('Excellent Content Results:');
    console.log('Grade:', excellentAnalysis.predictedGrade.grade);
    console.log('Percentage:', excellentAnalysis.predictedGrade.percentage + '%');
    
    console.log('\n=== TEST COMPLETE ===');
    console.log('The final analyzer should now give realistic grades based on actual content quality!');
    console.log('Poor content should get D/F grades');
    console.log('Excellent content should get A grades');
    console.log('Your files should get a grade based on their actual content');
    
  } catch (error) {
    console.error('Final analyzer test failed:', error);
    console.error('Error details:', error.message);
  }
}

testFinalAnalyzer();
