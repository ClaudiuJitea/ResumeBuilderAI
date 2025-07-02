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

    console.log(`Processing CV file: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Extract text from PDF
    const pdfData = await pdf(req.file.buffer);
    const cvText = pdfData.text;

    console.log(`Extracted text from PDF: ${cvText.length} characters`);
    console.log(`PDF text preview: ${cvText.substring(0, 300)}...`);

    if (!cvText || cvText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF'
      });
    }

    // Use AI to extract structured data
    console.log('Sending CV text to AI for extraction...');
    const extractedData = await aiService.extractDataFromCV(cvText);
    
    console.log(`AI extraction completed. Work experiences found: ${extractedData.work_experience?.length || 0}`);
    if (extractedData.work_experience && extractedData.work_experience.length > 0) {
      console.log('Work experience companies:', extractedData.work_experience.map(exp => exp.company || 'Unknown'));
    }
    
    console.log(`Certifications found: ${extractedData.certifications?.length || 0}`);
    if (extractedData.certifications && extractedData.certifications.length > 0) {
      console.log('Certification names:', extractedData.certifications.map(cert => cert.name || cert.title || 'Unknown'));
    }
    
    console.log(`Skills found: ${extractedData.skills?.length || 0}`);
    if (extractedData.skills && extractedData.skills.length > 0) {
      console.log('Skills extracted:', extractedData.skills.slice(0, 10)); // Log first 10 skills to avoid overwhelming logs
      if (extractedData.skills.length > 10) {
        console.log(`... and ${extractedData.skills.length - 10} more skills`);
      }
      
      // AI post-processing: Group and categorize skills
      console.log('Starting AI skill categorization...');
      try {
        // Convert skills to simple array of strings if they're objects
        const skillNames = extractedData.skills.map(skill => 
          typeof skill === 'string' ? skill : (skill.name || skill.skill || skill)
        ).filter(name => name && name.trim());
        
        console.log(`Extracted ${skillNames.length} skill names for categorization:`, skillNames.slice(0, 10));
        
        const categorizedSkills = await aiService.groupAndCategorizeSkills(skillNames);
        if (categorizedSkills && categorizedSkills.length > 0) {
          console.log(`Successfully categorized ${categorizedSkills.length} skills into multiple categories`);
          
          // Log the categories created
          const categories = [...new Set(categorizedSkills.map(skill => skill.category))];
          console.log(`Created ${categories.length} skill categories:`, categories);
          
          extractedData.skills = categorizedSkills;
        } else {
          console.log('AI categorization returned empty results, keeping original skills');
        }
      } catch (categorizationError) {
        console.error('Skills categorization failed, keeping original skills:', categorizationError);
        // Keep original skills as fallback
        extractedData.skills = extractedData.skills.map((skill, index) => ({
          name: typeof skill === 'string' ? skill : (skill.name || skill.skill || skill),
          category: 'Technical Skills'
        }));
      }
    } else {
      // Fallback: Try dedicated skills extraction
      console.log('No skills found in main extraction, trying dedicated skills extraction...');
      try {
        const fallbackSkills = await aiService.extractSkillsOnly(cvText);
        if (fallbackSkills && fallbackSkills.length > 0) {
          console.log(`Fallback skills extraction found ${fallbackSkills.length} skills:`, fallbackSkills);
          
          // AI post-processing for fallback skills too
          console.log('Starting AI skill categorization for fallback skills...');
          try {
            const categorizedFallbackSkills = await aiService.groupAndCategorizeSkills(fallbackSkills);
            if (categorizedFallbackSkills && categorizedFallbackSkills.length > 0) {
              console.log(`Successfully categorized ${categorizedFallbackSkills.length} fallback skills into multiple categories`);
              
              // Log the categories created
              const categories = [...new Set(categorizedFallbackSkills.map(skill => skill.category))];
              console.log(`Created ${categories.length} skill categories:`, categories);
              
              extractedData.skills = categorizedFallbackSkills;
            } else {
              extractedData.skills = fallbackSkills.map(skill => ({
                name: skill,
                category: 'Technical Skills'
              }));
            }
          } catch (categorizationError) {
            console.error('Fallback skills categorization failed, keeping uncategorized:', categorizationError);
            extractedData.skills = fallbackSkills.map(skill => ({
              name: skill,
              category: 'Technical Skills'
            }));
          }
        }
      } catch (fallbackError) {
        console.error('Fallback skills extraction failed:', fallbackError);
      }
    }
    
    res.json({
      success: true,
      data: {
        rawText: cvText,
        extractedData: extractedData
      }
    });

  } catch (error) {
    console.error('Parse CV error:', error);
    console.error('Error stack:', error.stack);
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

// Suggest skills based on user profile
router.post('/suggest-skills', authenticateToken, async (req, res) => {
  try {
    const { workExperience, position, education } = req.body;

    console.log('Generating skill suggestions for profile...');
    console.log('Position:', position);
    console.log('Work experience count:', workExperience?.length || 0);
    console.log('Education count:', education?.length || 0);

    const suggestedSkills = await aiService.suggestSkillsBasedOnProfile(
      workExperience || [],
      position || '',
      education || []
    );
    
    console.log('Generated skill suggestions:', suggestedSkills);
    
    res.json({
      success: true,
      data: {
        suggestedSkills: suggestedSkills
      }
    });

  } catch (error) {
    console.error('Skill suggestion error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to generate skill suggestions'
    });
  }
});

// Re-categorize existing skills using AI
router.post('/recategorize-skills', authenticateToken, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No skills provided for re-categorization'
      });
    }

    console.log('Re-categorizing skills:', skills);

    const categorizedSkills = await aiService.groupAndCategorizeSkills(skills);
    
    console.log('Skills re-categorization completed:', categorizedSkills);
    
    res.json({
      success: true,
      data: {
        categorizedSkills: categorizedSkills
      }
    });

  } catch (error) {
    console.error('Skill re-categorization error:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('OpenRouter') 
        ? 'AI service unavailable. Please contact administrator.'
        : 'Failed to re-categorize skills'
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