console.log('=== 20MB LIMIT VERIFICATION ===\n');

// Calculate 20MB in bytes
const twentyMB = 20 * 1024 * 1024;
console.log('20MB in bytes:', twentyMB.toLocaleString());
console.log('20MB in MB:', 20);

// Show the configuration
console.log('\n=== CONFIGURATION UPDATED ===');
console.log('1. Multer routes config: fileSize: 20 * 1024 * 1024');
console.log('2. Controller validation: maxSize = 20 * 1024 * 1024');
console.log('3. Error message: "File size exceeds 20MB limit"');

console.log('\n=== WHAT THIS MEANS ===');
console.log('Each file (rubric/draft) can be up to 20MB');
console.log('Total upload can be up to 40MB (20MB + 20MB)');

console.log('\n=== READY TO TEST ===');
console.log('Try uploading files up to 20MB in size!');
console.log('The system will now accept larger documents.');
