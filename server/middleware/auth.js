const jwt = require('jsonwebtoken');
const database = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Check if session exists in database
    const session = database.sessionOperations.getSession.get(token);
    if (!session) {
      return res.status(403).json({ 
        success: false, 
        message: 'Session expired or invalid' 
      });
    }

    // Get user details
    const user = database.userOperations.getUserById.get(decoded.userId);
    if (!user) {
      return res.status(403).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is suspended or inactive' 
      });
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }

  next();
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const session = database.sessionOperations.getSession.get(token);
        if (session) {
          const user = database.userOperations.getUserById.get(decoded.userId);
          if (user && user.status === 'active') {
            const { password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;
            req.token = token;
          }
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if there's an error
    next();
  }
};

// Create session in database
const createSession = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  try {
    database.sessionOperations.createSession.run(userId, token, expiresAt.toISOString());
    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
};

// Clean expired sessions
const cleanExpiredSessions = () => {
  try {
    const result = database.sessionOperations.cleanExpiredSessions.run();
    console.log(`Cleaned ${result.changes} expired sessions`);
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
  }
};

// Logout user (remove session)
const logout = (token) => {
  try {
    database.sessionOperations.deleteSession.run(token);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// Logout all user sessions
const logoutAllSessions = (userId) => {
  try {
    database.sessionOperations.deleteUserSessions.run(userId);
    return true;
  } catch (error) {
    console.error('Error logging out all sessions:', error);
    return false;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  requireAdmin,
  optionalAuth,
  createSession,
  cleanExpiredSessions,
  logout,
  logoutAllSessions,
  JWT_SECRET,
  JWT_EXPIRES_IN
}; 
