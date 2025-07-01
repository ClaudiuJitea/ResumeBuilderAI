const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pdf = require('pdf-parse');
const database = require('../database');
const { authenticateToken } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();
const aiService = new AIService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

// Upload CV endpoint
router.post('/upload', authenticateToken, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, originalname, path: filePath, size, mimetype } = req.file;
    const userId = req.user.id;

    // Extract text from PDF
    let extractedText = '';
    let extractedData = null;
    
    try {
      extractedText = await extractTextFromPDF(filePath);
      // Use AI to extract structured data
      extractedData = await aiService.extractDataFromCV(extractedText);
    } catch (error) {
      console.error('Error extracting CV data:', error);
      // Continue without extracted data
    }

    // Save to database
    const result = database.uploadedCVOperations.saveUploadedCV.run(
      userId,
      filename,
      originalname,
      filePath,
      size,
      mimetype,
      extractedData ? JSON.stringify(extractedData) : null
    );

    res.json({
      message: 'CV uploaded successfully',
      cv: {
        id: result.lastInsertRowid,
        originalName: originalname,
        fileName: filename,
        fileSize: size,
        extractedData: extractedData,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ error: 'Failed to upload CV' });
  }
});

// Get user's uploaded CVs
router.get('/uploaded', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const uploadedCVs = database.uploadedCVOperations.getUserUploadedCVs.all(userId);
    
    const cvsWithParsedData = uploadedCVs.map(cv => ({
      ...cv,
      extractedData: cv.extractedData ? JSON.parse(cv.extractedData) : null
    }));

    res.json(cvsWithParsedData);
  } catch (error) {
    console.error('Error fetching uploaded CVs:', error);
    res.status(500).json({ error: 'Failed to fetch uploaded CVs' });
  }
});

// Delete uploaded CV
router.delete('/uploaded/:id', authenticateToken, async (req, res) => {
  try {
    const cvId = req.params.id;
    const userId = req.user.id;

    // Get CV info first to delete file
    const cv = database.uploadedCVOperations.getUploadedCVById.get(cvId, userId);
    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(cv.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue even if file deletion fails
    }

    // Delete from database
    database.uploadedCVOperations.deleteUploadedCV.run(cvId, userId);

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ error: 'Failed to delete CV' });
  }
});

// CVGenie - Generate combined profile
router.post('/genie/generate', authenticateToken, async (req, res) => {
  try {
    const { selectedCVIds, targetRole, profileName } = req.body;
    const userId = req.user.id;

    if (!selectedCVIds || selectedCVIds.length === 0) {
      return res.status(400).json({ error: 'No CVs selected' });
    }

    if (!targetRole || !profileName) {
      return res.status(400).json({ error: 'Target role and profile name are required' });
    }

    // Get selected CVs
    const selectedCVs = selectedCVIds.map(id => 
      database.uploadedCVOperations.getUploadedCVById.get(id, userId)
    ).filter(cv => cv && cv.extractedData);

    if (selectedCVs.length === 0) {
      return res.status(400).json({ error: 'No valid CVs with extracted data found' });
    }

    // Extract data from selected CVs
    const extractedDataArray = selectedCVs.map(cv => JSON.parse(cv.extractedData));

    // Generate combined profile using AI
    const combinedProfile = await aiService.generateCombinedCVProfile(targetRole, extractedDataArray);

    // Save profile to database
    const sourceFilesInfo = selectedCVs.map(cv => ({
      id: cv.id,
      originalName: cv.originalName
    }));

    const result = database.cvProfileOperations.saveCVProfile.run(
      userId,
      profileName,
      targetRole,
      JSON.stringify(combinedProfile),
      JSON.stringify(sourceFilesInfo)
    );

    res.json({
      message: 'CV profile generated successfully',
      profile: {
        id: result.lastInsertRowid,
        profileName,
        targetRole,
        combinedData: combinedProfile,
        sourceFiles: sourceFilesInfo,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating CV profile:', error);
    res.status(500).json({ error: 'Failed to generate CV profile' });
  }
});

// Get user's CV profiles
router.get('/profiles', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profiles = database.cvProfileOperations.getUserCVProfiles.all(userId);
    
    const profilesWithParsedData = profiles.map(profile => ({
      ...profile,
      combinedData: JSON.parse(profile.combinedData),
      sourceFiles: JSON.parse(profile.sourceFiles)
    }));

    res.json(profilesWithParsedData);
  } catch (error) {
    console.error('Error fetching CV profiles:', error);
    res.status(500).json({ error: 'Failed to fetch CV profiles' });
  }
});

// Get specific CV profile
router.get('/profiles/:id', authenticateToken, async (req, res) => {
  try {
    const profileId = req.params.id;
    const userId = req.user.id;

    const profile = database.cvProfileOperations.getCVProfileById.get(profileId, userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      ...profile,
      combinedData: JSON.parse(profile.combinedData),
      sourceFiles: JSON.parse(profile.sourceFiles)
    });
  } catch (error) {
    console.error('Error fetching CV profile:', error);
    res.status(500).json({ error: 'Failed to fetch CV profile' });
  }
});

// Delete CV profile
router.delete('/profiles/:id', authenticateToken, async (req, res) => {
  try {
    const profileId = req.params.id;
    const userId = req.user.id;

    database.cvProfileOperations.deleteCVProfile.run(profileId, userId);
    res.json({ message: 'CV profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV profile:', error);
    res.status(500).json({ error: 'Failed to delete CV profile' });
  }
});

// Apply CV profile to new resume
router.post('/profiles/:id/apply', authenticateToken, async (req, res) => {
  try {
    const profileId = req.params.id;
    const userId = req.user.id;

    const profile = database.cvProfileOperations.getCVProfileById.get(profileId, userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const combinedData = JSON.parse(profile.combinedData);
    
    // Transform the combined data to resume format
    const resumeData = {
      personalInfo: {
        firstName: combinedData.personal_information?.name?.split(' ')[0] || '',
        lastName: combinedData.personal_information?.name?.split(' ').slice(1).join(' ') || '',
        position: combinedData.personal_information?.position || profile.targetRole,
        email: combinedData.personal_information?.email || '',
        phone: combinedData.personal_information?.phone || '',
        location: combinedData.personal_information?.location || '',
        contactStyle: 'symbols',
      },
      workExperience: combinedData.work_experience || [],
      education: combinedData.education || [],
      skills: combinedData.skills || [],
      languages: combinedData.languages || [],
      projects: combinedData.projects || [],
      certificates: combinedData.certifications || [],
      achievements: combinedData.achievements || [],
      aboutMe: `Professional ${profile.targetRole} with extensive experience and proven track record.`,
      interests: [],
      links: [],
      references: [],
      colorTheme: {
        id: 'cyan',
        name: 'Cyan Professional',
        primary: '#00FFCC',
        secondary: '#00E6B8',
        accent: '#3DDC91',
        gradient: {
          from: '#00FFCC',
          to: '#3DDC91'
        }
      },
      skillsConfig: {
        style: 'dots',
        position: 'left'
      }
    };

    res.json({
      message: 'CV profile applied successfully',
      resumeData: resumeData,
      profileInfo: {
        id: profile.id,
        profileName: profile.profileName,
        targetRole: profile.targetRole
      }
    });
  } catch (error) {
    console.error('Error applying CV profile:', error);
    res.status(500).json({ error: 'Failed to apply CV profile' });
  }
});

module.exports = router; 