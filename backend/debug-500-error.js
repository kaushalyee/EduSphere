const fs = require('fs');
const path = require('path');

function debug500Error() {
  console.log('=== DEBUGGING 500 ERROR ===\n');
  
  // Check 1: Upload directory
  const uploadsDir = path.join(__dirname, 'uploads');
  console.log('1. Upload Directory Check:');
  try {
    const stats = fs.statSync(uploadsDir);
    console.log('   Uploads directory exists: YES');
    console.log('   Directory size:', stats.size, 'bytes');
    
    const files = fs.readdirSync(uploadsDir);
    console.log('   Files in uploads:', files.length);
    console.log('   Total disk space used:', files.length * 1000, 'KB (estimated)');
    
    if (files.length > 100) {
      console.log('   WARNING: Too many files in uploads directory!');
    }
  } catch (error) {
    console.log('   Uploads directory exists: NO');
    console.log('   Error:', error.message);
  }
  
  // Check 2: Recent files
  console.log('\n2. Recent Files Check:');
  try {
    const files = fs.readdirSync(uploadsDir);
    const recentFiles = files.slice(-5); // Last 5 files
    
    recentFiles.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${file}: ${stats.size} bytes, created: ${stats.birthtime}`);
    });
  } catch (error) {
    console.log('   Error checking recent files:', error.message);
  }
  
  // Check 3: File types
  console.log('\n3. File Types Check:');
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileTypes = {};
    
    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    });
    
    console.log('   File type distribution:');
    Object.entries(fileTypes).forEach(([ext, count]) => {
      console.log(`   ${ext || 'no extension'}: ${count} files`);
    });
  } catch (error) {
    console.log('   Error checking file types:', error.message);
  }
  
  // Check 4: Large files
  console.log('\n4. Large Files Check:');
  try {
    const files = fs.readdirSync(uploadsDir);
    const largeFiles = files.filter(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return stats.size > 5 * 1024 * 1024; // >5MB
    });
    
    if (largeFiles.length > 0) {
      console.log('   Large files found (>5MB):');
      largeFiles.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   ${file}: ${Math.round(stats.size / 1024 / 1024)}MB`);
      });
    } else {
      console.log('   No large files found');
    }
  } catch (error) {
    console.log('   Error checking large files:', error.message);
  }
  
  console.log('\n=== DEBUG COMPLETE ===');
  console.log('\nIf you see issues above, here are the fixes:');
  console.log('- Too many files: Delete old files from uploads folder');
  console.log('- Large files: Upload smaller files (<5MB)');
  console.log('- Invalid file types: Use only PDF, DOC, DOCX, TXT');
  console.log('- Directory issues: Restart the server');
}

debug500Error();
