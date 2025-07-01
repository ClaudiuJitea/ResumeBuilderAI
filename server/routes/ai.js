const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { authenticateToken } = require('../middleware/auth');
const AIService = require('../services/aiService');
const aiService = new AIService();

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Apply authentication to all routes
router.use(authenticateToken);

// Parse CV PDF and extract data
router.post('/parse-cv', upload.single('cvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided'
      });
    }

    // Extract text from PDF
    const pdfData = await pdf(req.file.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF'
      });
    }

    // Use AI to extract structured data
    const extractedData = await aiService.extractDataFromCV(cvText);
    
    res.json({
      success: true,
      data: {
        rawText: cvText,
        extractedData: extractedData
      }
    });

  } catch (error) {
    console.error('Parse CV error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to parse CV'
    });
  }
});

// Get content suggestions for a specific section
router.post('/suggest-content', async (req, res) => {
  try {
    const { section, context } = req.body;

    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Section is required'
      });
    }

    const suggestions = await aiService.suggestContent(section, context || '');
    
    res.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    console.error('Suggest content error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to generate suggestions'
    });
  }
});

// Rephrase text content
router.post('/rephrase', async (req, res) => {
  try {
    const { text, style } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Text is too long (max 1000 characters)'
      });
    }

    const rephrasedText = await aiService.rephraseContent(text, style || 'professional');
    
    res.json({
      success: true,
      data: { rephrasedText }
    });

  } catch (error) {
    console.error('Rephrase error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to rephrase text'
    });
  }
});

// Improve a specific resume section
router.post('/improve-section', async (req, res) => {
  try {
    const { sectionType, sectionData } = req.body;

    if (!sectionType || !sectionData) {
      return res.status(400).json({
        success: false,
        message: 'Section type and data are required'
      });
    }

    const improvements = await aiService.improveSection(sectionType, sectionData);
    
    res.json({
      success: true,
      data: { improvements }
    });

  } catch (error) {
    console.error('Improve section error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to improve section'
    });
  }
});

// Generate job-tailored suggestions
router.post('/tailor-resume', async (req, res) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription || !resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Job description and resume data are required'
      });
    }

    if (jobDescription.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Job description is too long (max 2000 characters)'
      });
    }

    const suggestions = await aiService.generateJobTailoredSuggestions(jobDescription, resumeData);
    
    res.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    console.error('Tailor resume error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to generate tailored suggestions'
    });
  }
});

// Check AI service status
router.get('/status', async (req, res) => {
  try {
    // Try to get API key to check if service is configured
    await aiService.getApiKeyAndModel();
    
    res.json({
      success: true,
      data: {
        available: true,
        message: 'AI service is available'
      }
    });

  } catch (error) {
    res.json({
      success: true,
      data: {
        available: false,
        message: 'AI service is not configured'
      }
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large (max 10MB)'
      });
    }
  }
  
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files are allowed'
    });
  }
  
  next(error);
});

module.exports = router; 