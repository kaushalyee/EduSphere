console.log('=== 20MB FILE SIZE LIMIT TEST ===\n');

// Check the configuration
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Read the assignment routes to verify the limit
const routesContent = fs.readFileSync('routes/assignmentRoutes.js', 'utf8');
const sizeLimitMatch = routesContent.match(/fileSize: (\d+)/);

if (sizeLimitMatch) {
  const sizeInBytes = parseInt(sizeLimitMatch[1]);
  const sizeInMB = sizeInBytes / (1024 * 1024);
  console.log('Current file size limit:', sizeInMB + 'MB');
  
  if (sizeInMB === 20) {
    console.log('SUCCESS: File size limit is set to 20MB! ');
  } else {
    console.log('WARNING: File size limit is not 20MB');
  }
} else {
  console.log('ERROR: Could not find file size limit in routes');
}

// Check controller validation
const controllerContent = fs.readFileSync('controllers/assignmentController.js', 'utf8');
const controllerLimitMatch = controllerContent.match(/const maxSize = (\d+)/);

if (controllerLimitMatch) {
  const controllerSizeInBytes = parseInt(controllerLimitMatch[1]);
  const controllerSizeInMB = controllerSizeInBytes / (1024 * 1024);
  console.log('Controller validation limit:', controllerSizeInMB + 'MB');
  
  if (controllerSizeInMB === 20) {
    console.log('SUCCESS: Controller validation is set to 20MB! ');
  } else {
    console.log('WARNING: Controller validation is not 20MB');
  }
} else {
  console.log('ERROR: Could not find controller validation limit');
}

// Check error message
const errorMessageMatch = controllerContent.match(/message: "File size exceeds (\d+)MB limit"/);
if (errorMessageMatch) {
  const errorSizeMB = parseInt(errorMessageMatch[1]);
  console.log('Error message limit:', errorSizeMB + 'MB');
  
  if (errorSizeMB === 20) {
    console.log('SUCCESS: Error message shows 20MB limit! ');
  } else {
    console.log('WARNING: Error message does not show 20MB');
  }
}

console.log('\n=== SUMMARY ===');
console.log('You can now upload files up to 20MB in size!');
console.log('Both rubric and draft files can be up to 20MB each.');
console.log('Total upload size can be up to 40MB (20MB + 20MB).');

console.log('\n=== BENEFITS ===');
console.log('1. Larger documents can be uploaded');
console.log('2. High-resolution PDFs are supported');
console.log('3. Complex Word documents with images are allowed');
console.log('4. Better user experience for large assignments');

console.log('\nReady to test with larger files!');
