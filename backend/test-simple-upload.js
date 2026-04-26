const fs = require('fs');
const path = require('path');

// Create a simple test file to upload
const testContent = `
Test Assignment Rubric

Criteria:
1. Content Quality (40%)
   - Clear and logical structure
   - Relevant examples and evidence
   - Proper citations

2. Analysis (30%)
   - Critical thinking demonstrated
   - Multiple perspectives considered
   - Original insights provided

3. Writing Style (20%)
   - Grammar and spelling
   - Academic tone
   - Proper formatting

4. Requirements (10%)
   - Length requirements met
   - Deadline adherence
   - Instructions followed
`;

const testDraft = `
Test Assignment Draft

Introduction:
This is a test assignment draft that demonstrates the student's understanding of the topic.

Main Content:
The assignment provides clear analysis with relevant examples. Critical thinking is demonstrated through multiple perspectives. The writing follows academic standards with proper grammar and formatting.

Conclusion:
The requirements have been met and the assignment demonstrates quality work.
`;

// Create test files
fs.writeFileSync('test-rubric.txt', testContent);
fs.writeFileSync('test-draft.txt', testDraft);

console.log('Test files created:');
console.log('- test-rubric.txt');
console.log('- test-draft.txt');
console.log('You can now use these files to test the upload functionality.');
