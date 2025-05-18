const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { parsePdfQuestions, saveQuestionsToDb } = require('./pdfParser');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Only connect to MongoDB when this file is run directly
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cv-mock-test';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected');
    isConnected = true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err; // Rethrow to handle in the calling function
  }
};

/**
 * Import questions from a PDF file
 * @param {String} pdfPath Path to the PDF file
 * @param {Object} metadata Metadata for the questions (exam, year, topic)
 */
async function importQuestionsFromPdf(pdfPath, metadata) {
  try {
    console.log(`Importing questions from ${pdfPath}...`);
    
    // Parse questions from PDF
    const questions = await parsePdfQuestions(pdfPath, metadata);
    
    console.log(`Found ${questions.length} questions in the PDF`);
    
    // Save questions to database if there are any
    if (questions.length > 0) {
      try {
        // Connect to MongoDB if this is imported (not run directly)
        if (require.main !== module && !isConnected) {
          await connectDB();
        }
        
        const savedQuestions = await saveQuestionsToDb(questions);
        console.log(`Successfully saved ${savedQuestions.length} questions to the database`);
      } catch (dbError) {
        console.error('Failed to save questions to database:', dbError);
        console.log('Returning parsed questions without saving to database');
      }
    } else {
      console.log('No questions found in the PDF');
    }
    
    return questions;
  } catch (error) {
    console.error('Error importing questions:', error);
    throw error;
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node importQuestions.js <pdfPath> <exam> <year> [topic]');
    process.exit(1);
  }
  
  const pdfPath = args[0];
  const metadata = {
    exam: args[1],
    year: args[2],
    topic: args[3] || 'General'
  };
  
  // Connect to MongoDB and import questions
  connectDB()
    .then(() => importQuestionsFromPdf(pdfPath, metadata))
    .then(() => {
      console.log('Import completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Import failed:', err);
      process.exit(1);
    });
}

module.exports = { importQuestionsFromPdf }; 