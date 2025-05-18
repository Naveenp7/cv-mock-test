const express = require('express');
const router = express.Router();
const { uploadPdf, getPdfQuestions } = require('../controllers/pdfController');

// Routes
router.post('/upload', uploadPdf);
router.get('/questions', getPdfQuestions);

module.exports = router; 