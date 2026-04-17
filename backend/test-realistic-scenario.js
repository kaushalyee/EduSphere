const assignmentAnalyzer = require('./services/assignmentAnalyzerFixed');
const fs = require('fs');

async function testRealisticScenario() {
  try {
    console.log('=== REALISTIC SCENARIO TEST ===\n');
    
    // Create a realistic rubric file
    const realisticRubric = `
    IT 3050: Employability Skills Development
    
    Assignment Rubric for Evidence-Based Reflection
    
    1. Self-Reflection (25 marks)
       - Demonstrates personal awareness and growth
       - Shows understanding of own strengths and weaknesses
    
    2. Evidence & Examples (25 marks)
       - Provides specific examples and incidents
       - Uses concrete evidence to support claims
    
    3. Critical Analysis (25 marks)
       - Analyzes experiences critically
       - Shows deeper insight and understanding
    
    4. Action Planning (25 marks)
       - Identifies specific areas for improvement
       - Creates actionable development plan
    `;
    
    // Create a POOR draft that should get low marks
    const poorDraft = `
    My name is John and I'm a student.
    I had an assignment but it was hard.
    I didn't do well on it.
    
    I need to improve but I don't know how.
    Maybe I can study more.
    
    The end.
    `;
    
    // Create a GOOD draft that should get high marks
    const goodDraft = `
    Self-Reflection:
    During my second-year software development project, I encountered significant challenges in time management that led to missed deadlines. This experience revealed my tendency to underestimate task complexity and overcommit to multiple responsibilities simultaneously. Through this failure, I developed greater self-awareness about my work patterns and limitations.
    
    Evidence & Examples:
    A specific incident occurred when I was juggling a part-time RCM job with our group project. Two days before submission, I realized our backend module was incomplete. Despite working 12-hour days, I couldn't deliver on time. This concrete example demonstrates how poor planning and unrealistic time allocation directly impacted my academic performance.
    
    Critical Analysis:
    The root cause was not merely time scarcity but my failure to prioritize tasks and communicate proactively with team members. I now understand that effective time management requires strategic planning, regular progress checks, and the courage to seek help early rather than struggling in isolation.
    
    Action Planning:
    I have implemented a three-step improvement plan: (1) Use digital time-tracking tools to monitor task completion, (2) Schedule weekly team progress meetings, and (3) Set personal deadlines two days before actual deadlines. These specific actions will prevent recurrence of this issue.
    `;
    
    // Write test files
    fs.writeFileSync('uploads/realistic-rubric.txt', realisticRubric);
    fs.writeFileSync('uploads/poor-draft.txt', poorDraft);
    fs.writeFileSync('uploads/good-draft.txt', goodDraft);
    
    console.log('1. Testing POOR draft (should get low grade)...');
    const poorAnalysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/realistic-rubric.txt',
      'uploads/poor-draft.txt'
    );
    
    console.log('POOR Draft Results:');
    console.log('Grade:', poorAnalysis.predictedGrade.grade);
    console.log('Percentage:', poorAnalysis.predictedGrade.percentage + '%');
    console.log('Total Marks:', poorAnalysis.predictedGrade.totalMarks);
    console.log('Earned Marks:', poorAnalysis.predictedGrade.earnedMarks);
    
    console.log('\nDetailed Breakdown:');
    poorAnalysis.gradingBreakdown.forEach((item, index) => {
      const percentage = Math.round((item.predictedMarks / item.maxMarks) * 100);
      console.log(`${index + 1}. ${item.criteria}: ${item.predictedMarks}/${item.maxMarks} (${percentage}%) - ${item.feedback}`);
    });
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    console.log('2. Testing GOOD draft (should get high grade)...');
    const goodAnalysis = await assignmentAnalyzer.analyzeSubmission(
      'uploads/realistic-rubric.txt',
      'uploads/good-draft.txt'
    );
    
    console.log('GOOD Draft Results:');
    console.log('Grade:', goodAnalysis.predictedGrade.grade);
    console.log('Percentage:', goodAnalysis.predictedGrade.percentage + '%');
    console.log('Total Marks:', goodAnalysis.predictedGrade.totalMarks);
    console.log('Earned Marks:', goodAnalysis.predictedGrade.earnedMarks);
    
    console.log('\nDetailed Breakdown:');
    goodAnalysis.gradingBreakdown.forEach((item, index) => {
      const percentage = Math.round((item.predictedMarks / item.maxMarks) * 100);
      console.log(`${index + 1}. ${item.criteria}: ${item.predictedMarks}/${item.maxMarks} (${percentage}%) - ${item.feedback}`);
    });
    
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('=== SUMMARY ===');
    console.log('POOR draft should get: C, D, or F grade');
    console.log('GOOD draft should get: A or B grade');
    console.log('If both show the same grade, there\'s still an issue!');
    
  } catch (error) {
    console.error('Realistic test failed:', error);
    console.error('Error details:', error.message);
  }
}

testRealisticScenario();
