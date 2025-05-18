const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Question = require('../models/Question');

/**
 * Parse PDF file and extract questions in a format compatible with our Question model
 * 
 * This function is customized for the specific PDF format provided
 * 
 * @param {String} pdfPath Path to the PDF file
 * @param {Object} metadata Additional metadata for questions (exam, year, topic)
 * @returns {Array} Array of question objects ready to be saved to database
 */
async function parsePdfQuestions(pdfPath, metadata = {}) {
  try {
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`File not found: ${pdfPath}`);
    }

    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    
    // Get text content
    const text = pdfData.text;
    
    // Log the raw text for debugging
    console.log('Raw PDF text (first 500 chars):', text.substring(0, 500));
    
    // Split into lines and clean up
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Extract questions using a more robust approach
    const questions = [];
    let currentQuestion = null;
    let currentOptions = [];
    let currentOptionIndex = -1;
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for question patterns (adjust these based on your PDF format)
      // Pattern: "1. Question text" or just a line that looks like a question
      if (/^\d+\./.test(line) || (i > 0 && line.endsWith('?'))) {
        // If we already have a question in progress, save it
        if (currentQuestion && currentOptions.length > 0) {
          // Make sure we have exactly 4 options, pad if necessary
          while (currentOptions.length < 4) {
            currentOptions.push(`Option ${currentOptions.length + 1}`);
          }
          
          questions.push({
            ...currentQuestion,
            options: currentOptions.slice(0, 4), // Ensure exactly 4 options
            ...metadata
          });
        }
        
        // Start a new question
        currentQuestion = {
          question: line.replace(/^\d+\.\s*/, ''), // Remove leading number if present
          correct: 0, // Default, will be updated later
          explanation: ''
        };
        currentOptions = [];
        currentOptionIndex = -1;
        continue;
      }
      
      // Look for option patterns
      // Pattern: "A. Option text" or "1) Option text" or similar
      const optionMatch = line.match(/^([A-D]|[1-4])[\.\)]\s*(.+)$/i);
      if (optionMatch && currentQuestion) {
        const optionLetter = optionMatch[1].toUpperCase();
        const optionText = optionMatch[2].trim();
        
        // Determine option index (0-based)
        if (optionLetter >= 'A' && optionLetter <= 'D') {
          currentOptionIndex = optionLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        } else {
          currentOptionIndex = parseInt(optionLetter) - 1;
        }
        
        // Ensure we have enough space in the options array
        while (currentOptions.length <= currentOptionIndex) {
          currentOptions.push('');
        }
        
        // Set the option text
        currentOptions[currentOptionIndex] = optionText;
        
        // Check if this option is marked as correct (customize based on your PDF format)
        if (optionText.toLowerCase().includes('(correct)') || 
            optionText.toLowerCase().includes('(answer)') ||
            (lines[i+1] && lines[i+1].toLowerCase().includes('answer') && lines[i+1].includes(optionLetter))) {
          currentQuestion.correct = currentOptionIndex;
        }
        
        continue;
      }
      
      // Look for answer indicators
      if (line.toLowerCase().includes('answer:') && currentQuestion) {
        const answerMatch = line.match(/answer:\s*([A-D]|[1-4])/i);
        if (answerMatch) {
          const answer = answerMatch[1].toUpperCase();
          if (answer >= 'A' && answer <= 'D') {
            currentQuestion.correct = answer.charCodeAt(0) - 'A'.charCodeAt(0);
          } else {
            currentQuestion.correct = parseInt(answer) - 1;
          }
        }
        continue;
      }
      
      // If we have a current option, append this line to it (for multi-line options)
      if (currentOptionIndex >= 0 && currentOptions[currentOptionIndex] && !optionMatch) {
        currentOptions[currentOptionIndex] += ' ' + line;
        continue;
      }
      
      // If we have a current question but no option match, it might be part of the question text
      if (currentQuestion && currentOptions.length === 0 && !line.match(/^(answer|explanation):/i)) {
        currentQuestion.question += ' ' + line;
        continue;
      }
      
      // Check for explanation
      if (line.toLowerCase().startsWith('explanation:') && currentQuestion) {
        currentQuestion.explanation = line.replace(/^explanation:\s*/i, '').trim();
        continue;
      }
    }
    
    // Add the last question if it exists
    if (currentQuestion && currentOptions.length > 0) {
      // Make sure we have exactly 4 options, pad if necessary
      while (currentOptions.length < 4) {
        currentOptions.push(`Option ${currentOptions.length + 1}`);
      }
      
      questions.push({
        ...currentQuestion,
        options: currentOptions.slice(0, 4), // Ensure exactly 4 options
        ...metadata
      });
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}

/**
 * Save parsed questions to the database
 * 
 * @param {Array} questions Array of question objects
 * @returns {Array} Array of saved question documents
 */
async function saveQuestionsToDb(questions) {
  try {
    // Validate questions before saving
    questions.forEach((q, index) => {
      if (!q.question || !q.options || q.options.length !== 4 || q.correct === undefined) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });
    
    // Save questions to database
    const savedQuestions = await Question.insertMany(questions);
    return savedQuestions;
  } catch (error) {
    console.error('Error saving questions to database:', error);
    throw error;
  }
}

module.exports = {
  parsePdfQuestions,
  saveQuestionsToDb
}; 