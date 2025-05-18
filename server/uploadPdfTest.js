const path = require('path');
const mongoose = require('mongoose');
const { importQuestionsFromPdf } = require('./utils/importQuestions');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// PDF path (adjust as needed)
const pdfPath = path.join(__dirname, '..', 'cvpaper.pdf');

// Metadata for questions
const metadata = {
  exam: 'CV',
  year: '2023',
  topic: 'General'
};

// Connect to MongoDB and import questions
async function uploadPdfTest() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected');
    console.log(`Importing questions from ${pdfPath}...`);
    
    // Import questions from PDF
    const questions = await importQuestionsFromPdf(pdfPath, metadata);
    
    console.log(`Successfully imported ${questions.length} questions from the PDF`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error uploading PDF:', error);
    
    // Ensure MongoDB connection is closed even if there's an error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB Disconnected after error');
    }
  }
}

// Run the test
uploadPdfTest(); 