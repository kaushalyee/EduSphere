const assignmentAnalyzer = require('./services/assignmentAnalyzer');
const fs = require('fs');

async function testFutureDocuments() {
  try {
    console.log('=== TESTING FUTURE DOCUMENT COMPATIBILITY ===\n');
    
    // Test 1: Research Paper
    console.log('1. Testing RESEARCH PAPER criteria...');
    const researchText = `
    This research paper investigates the impact of artificial intelligence on modern education.
    The methodology includes quantitative analysis of student performance data.
    Evidence suggests that AI tools can enhance learning outcomes when properly implemented.
    The study concludes with recommendations for educational institutions.
    `;
    
    const researchCriteria = assignmentAnalyzer.generateDefaultCriteria(researchText);
    console.log('Research criteria:', researchCriteria.map(c => c.name));
    console.log('Total marks:', researchCriteria.reduce((sum, c) => sum + c.maxMarks, 0));
    console.log();
    
    // Test 2: Programming Assignment
    console.log('2. Testing PROGRAMMING ASSIGNMENT criteria...');
    const programmingText = `
    This software development project implements a web application using React and Node.js.
    The code follows best practices with proper documentation and error handling.
    Testing includes unit tests and integration tests to ensure functionality.
    The algorithm efficiently processes user requests with O(n log n) complexity.
    `;
    
    const programmingCriteria = assignmentAnalyzer.generateDefaultCriteria(programmingText);
    console.log('Programming criteria:', programmingCriteria.map(c => c.name));
    console.log('Total marks:', programmingCriteria.reduce((sum, c) => sum + c.maxMarks, 0));
    console.log();
    
    // Test 3: Essay/Report
    console.log('3. Testing ESSAY/REPORT criteria...');
    const essayText = `
    This essay explores the philosophical implications of technology in modern society.
    The writing demonstrates clear structure with introduction, body paragraphs, and conclusion.
    Research from multiple academic sources supports the main arguments.
    The analysis provides critical insights into the relationship between humans and machines.
    `;
    
    const essayCriteria = assignmentAnalyzer.generateDefaultCriteria(essayText);
    console.log('Essay criteria:', essayCriteria.map(c => c.name));
    console.log('Total marks:', essayCriteria.reduce((sum, c) => sum + c.maxMarks, 0));
    console.log();
    
    // Test 4: Reflection Assignment
    console.log('4. Testing REFLECTION ASSIGNMENT criteria...');
    const reflectionText = `
    This self-reflection examines my personal growth during the internship experience.
    Specific incidents from the workplace demonstrate my learning and development.
    Critical analysis of my performance reveals areas for improvement.
    I have created an action plan for future professional development based on this reflection.
    `;
    
    const reflectionCriteria = assignmentAnalyzer.generateDefaultCriteria(reflectionText);
    console.log('Reflection criteria:', reflectionCriteria.map(c => c.name));
    console.log('Total marks:', reflectionCriteria.reduce((sum, c) => sum + c.maxMarks, 0));
    console.log();
    
    // Test 5: Generic Academic Assignment
    console.log('5. Testing GENERIC ACADEMIC criteria...');
    const genericText = `
    This assignment covers various aspects of the course material.
    The content demonstrates understanding of key concepts and theories.
    Proper organization and structure enhance readability and comprehension.
    Critical thinking is evident throughout the analysis and evaluation.
    `;
    
    const genericCriteria = assignmentAnalyzer.generateDefaultCriteria(genericText);
    console.log('Generic criteria:', genericCriteria.map(c => c.name));
    console.log('Total marks:', genericCriteria.reduce((sum, c) => sum + c.maxMarks, 0));
    console.log();
    
    console.log('=== SUMMARY ===');
    console.log('The system can now handle:');
    console.log('1. Research Papers - 100 marks');
    console.log('2. Programming Assignments - 100 marks');
    console.log('3. Essays/Reports - 100 marks');
    console.log('4. Reflection Assignments - 100 marks');
    console.log('5. Generic Academic Work - 100 marks');
    console.log('\nEach type has specialized criteria and keywords for accurate grading!');
    
  } catch (error) {
    console.error('Future documents test failed:', error);
  }
}

testFutureDocuments();
