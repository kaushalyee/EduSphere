const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

// Test the upload endpoint
async function testUpload() {
  try {
    const form = new FormData();
    
    // Add mock files (you'll need to replace these with actual files)
    // For now, let's just test the endpoint structure
    
    form.append('requirementId', 'default-assignment-id');
    form.append('studentId', 'test-student-id');
    
    console.log('Testing upload endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/assignments/submit-with-rubric', form, {
      headers: {
        ...form.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testUpload();
