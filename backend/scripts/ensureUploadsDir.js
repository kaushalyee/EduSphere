// Script to ensure uploads directory exists when server starts
const fs = require('fs');
const path = require('path');

// Define the uploads directory path
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created successfully');
} else {
  console.log('Uploads directory already exists:', uploadsDir);
}

// Also create subdirectories for better organization
const subdirs = ['assignments', 'rubrics', 'drafts'];

subdirs.forEach(subdir => {
  const subdirPath = path.join(uploadsDir, subdir);
  if (!fs.existsSync(subdirPath)) {
    console.log('Creating subdirectory:', subdir);
    fs.mkdirSync(subdirPath, { recursive: true });
  }
});

console.log('Upload directory setup complete');
