const pdfParse = require('pdf-parse');
const fs = require('fs');

async function testPdfParse() {
  try {
    console.log('Testing pdf-parse import...');
    console.log('pdfParse type:', typeof pdfParse);
    console.log('pdfParse:', pdfParse);
    
    // Find a PDF file
    const files = fs.readdirSync('uploads');
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length > 0) {
      const pdfPath = 'uploads/' + pdfFiles[0];
      console.log('Testing with:', pdfPath);
      
      const buffer = fs.readFileSync(pdfPath);
      console.log('Buffer length:', buffer.length);
      
      // Try different ways to call pdfParse
      try {
        console.log('Trying pdfParse(buffer)...');
        const result = await pdfParse(buffer);
        console.log('Success! Text length:', result.text.length);
      } catch (error) {
        console.log('pdfParse(buffer) failed:', error.message);
        
        try {
          console.log('Trying pdfParse.default(buffer)...');
          const result = await pdfParse.default(buffer);
          console.log('Success! Text length:', result.text.length);
        } catch (error2) {
          console.log('pdfParse.default(buffer) failed:', error2.message);
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPdfParse();
