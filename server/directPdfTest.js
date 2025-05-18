const path = require('path');
const { parsePdfQuestions } = require('./utils/pdfParser');

// PDF path (adjust as needed)
const pdfPath = path.join(__dirname, '..', 'cvpaper.pdf');

// Metadata for questions
const metadata = {
  exam: 'CV',
  year: '2023',
  topic: 'General'
};

// Parse PDF without saving to database
async function testPdfParser() {
  try {
    console.log(`Testing PDF parser with file: ${pdfPath}`);
    
    // Parse PDF without connecting to database
    const questions = await parsePdfQuestions(pdfPath, metadata);
    
    console.log(`Found ${questions.length} questions in the PDF`);
    
    // Display all questions
    console.log('\nExtracted Questions:');
    
    questions.forEach((q, index) => {
      console.log(`\nQuestion ${index+1}: ${q.question}`);
      console.log('Options:');
      q.options.forEach((opt, idx) => {
        const marker = idx === q.correct ? '✓' : ' ';
        console.log(`  ${marker} ${String.fromCharCode(65 + idx)}. ${opt}`);
      });
      if (q.explanation) {
        console.log(`Explanation: ${q.explanation}`);
      }
    });
    
    console.log('\nPDF parsing test completed successfully');
  } catch (error) {
    console.error('Error testing PDF parser:', error);
  }
}

// Run the test
testPdfParser(); 