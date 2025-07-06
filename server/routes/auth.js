const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const database = require('../database');
const { 
  generateToken, 
  authenticateToken, 
  createSession, 
  logout,
  logoutAllSessions 
} = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register route
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = database.userOperations.getUserByEmail.get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = database.userOperations.createUser.run(
      email,
      hashedPassword,
      firstName,
      lastName,
      'user',
      'active'
    );

    // Generate token
    const token = generateToken(result.lastInsertRowid);
    
    // Create session
    await createSession(result.lastInsertRowid, token);

    // Get user data (without password)
    const newUser = database.userOperations.getUserById.get(result.lastInsertRowid);
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login route
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user
    const user = database.userOperations.getUserByEmail.get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended or inactive'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    database.userOperations.updateLastLogin.run(user.id);

    // Generate token
    const token = generateToken(user.id);
    
    // Create session
    await createSession(user.id, token);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Logout route
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const success = logout(req.token);
    
    if (success) {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Logout all sessions
router.post('/logout-all', authenticateToken, (req, res) => {
  try {
    const success = logoutAllSessions(req.user.id);
    
    if (success) {
      res.json({
        success: true,
        message: 'Logged out from all devices successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if email is already taken by another user
    const existingUser = database.userOperations.getUserByEmail.get(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({
        success: false,
        message: 'Email is already taken by another user'
      });
    }

    // Update user
    database.userOperations.updateUser.run(
      firstName,
      lastName,
      email,
      req.user.role, // Keep existing role
      req.user.status, // Keep existing status
      userId
    );

    // Get updated user
    const updatedUser = database.userOperations.getUserById.get(userId);
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = database.userOperations.getUserById.get(userId);
    
    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    database.userOperations.updatePassword.run(hashedNewPassword, userId);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed'
    });
  }
});

// Verify token (for frontend to check if user is still authenticated)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
});

// Resume management endpoints
// Get user's resumes
router.get('/resumes', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = database.resumeOperations.getUserResumes.all(userId);
    
    res.json({
      success: true,
      resumes: resumes
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes'
    });
  }
});

// Get specific resume
router.get('/resumes/:id', authenticateToken, (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user.id;
    
    const resume = database.resumeOperations.getResumeById.get(resumeId, userId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      resume: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume'
    });
  }
});

// Save/Create resume
router.post('/resumes', authenticateToken, (req, res) => {
  try {
    const { resumeData, title, template } = req.body;
    const userId = req.user.id;
    
    if (!resumeData || !title || !template) {
      return res.status(400).json({
        success: false,
        message: 'Resume data, title, and template are required'
      });
    }
    
    const result = database.resumeOperations.saveResume.run(
      userId,
      JSON.stringify(resumeData),
      title,
      template
    );
    
    res.status(201).json({
      success: true,
      message: 'Resume saved successfully',
      resume: {
        id: result.lastInsertRowid,
        title: title,
        template: template,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume'
    });
  }
});

// Update resume
router.put('/resumes/:id', authenticateToken, (req, res) => {
  try {
    const resumeId = req.params.id;
    const { resumeData, title, template } = req.body;
    const userId = req.user.id;
    
    if (!resumeData || !title || !template) {
      return res.status(400).json({
        success: false,
        message: 'Resume data, title, and template are required'
      });
    }
    
    const result = database.resumeOperations.updateResume.run(
      JSON.stringify(resumeData),
      title,
      template,
      resumeId,
      userId
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Resume updated successfully'
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume'
    });
  }
});

// Delete resume
router.delete('/resumes/:id', authenticateToken, (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user.id;
    
    const result = database.resumeOperations.deleteResume.run(resumeId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
});

module.exports = router; 