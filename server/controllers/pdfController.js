const path = require('path');
const fs = require('fs');
const { importQuestionsFromPdf } = require('../utils/importQuestions');
const Question = require('../models/Question');

/**
 * @desc    Upload PDF and extract questions
 * @route   POST /api/pdf/upload
 * @access  Private (Admin only)
 */
exports.uploadPdf = async (req, res) => {
  try {
    // Validate request
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please upload a PDF file' 
      });
    }

    const pdfFile = req.files.pdf;
    
    // Validate file type
    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ 
        success: false, 
        error: 'File must be a PDF' 
      });
    }
    
    const { exam, year, topic } = req.body;

    // Validate required fields
    if (!exam || !year) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide exam and year information' 
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${exam}_${year}_${timestamp}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    try {
      // Move the file to uploads directory
      await pdfFile.mv(filePath);
      
      // Extract questions from PDF
      const metadata = { exam, year, topic: topic || 'General' };
      const questions = await importQuestionsFromPdf(filePath, metadata);

      res.status(200).json({
        success: true,
        data: {
          filename,
          questionsCount: questions.length,
          message: `Successfully extracted ${questions.length} questions from the PDF`
        }
      });
    } catch (error) {
      // Clean up file if extraction fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing PDF',
      message: error.message
    });
  }
};

/**
 * @desc    Get questions imported from PDFs
 * @route   GET /api/pdf/questions
 * @access  Private
 */
exports.getPdfQuestions = async (req, res) => {
  try {
    const { exam, year, topic, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    if (exam) query.exam = exam;
    if (year) query.year = year;
    if (topic) query.topic = topic;
    
    // Count total questions matching the query
    const total = await Question.countDocuments(query);
    
    // Get paginated questions
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      data: questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting PDF questions:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting PDF questions',
      message: error.message
    });
  }
}; 