const path = require('path');
const mongoose = require('mongoose');
const { parsePdfQuestions } = require('./utils/pdfParser');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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
    
    // Display the first 3 questions (or all if less than 3)
    const sampleSize = Math.min(3, questions.length);
    console.log(`\nSample of ${sampleSize} questions:`);
    
    for (let i = 0; i < sampleSize; i++) {
      const q = questions[i];
      console.log(`\nQuestion ${i+1}: ${q.question}`);
      console.log('Options:');
      q.options.forEach((opt, idx) => {
        console.log(`  ${String.fromCharCode(65 + idx)}. ${opt}`);
      });
      console.log(`Correct Answer: ${String.fromCharCode(65 + q.correct)}`);
      if (q.explanation) {
        console.log(`Explanation: ${q.explanation}`);
      }
    }
    
    console.log('\nPDF parsing test completed successfully');
  } catch (error) {
    console.error('Error testing PDF parser:', error);
  }
}

// Run the test
testPdfParser(); 