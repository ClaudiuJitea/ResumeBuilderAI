const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database connection
const db = new Database(path.join(__dirname, 'database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'deleted')),
      avatar TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLogin DATETIME
    )
  `;

  // User sessions table for JWT token management
  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    )
  `;

  // User resumes table to link resumes to users
  const createResumesTable = `
    CREATE TABLE IF NOT EXISTS user_resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      resumeData TEXT NOT NULL,
      title TEXT NOT NULL,
      template TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    )
  `;

  // Execute table creation
  db.exec(createUsersTable);
  db.exec(createSessionsTable);
  db.exec(createResumesTable);

  console.log('Database tables created successfully');
};

// Create default admin user
const createDefaultAdmin = async () => {
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin');
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const insertAdmin = db.prepare(`
      INSERT INTO users (email, password, firstName, lastName, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertAdmin.run('admin@resumeai.com', hashedPassword, 'Admin', 'User', 'admin');
    console.log('Default admin user created: admin@resumeai.com / admin123');
  }
};

// Initialize prepared statements after tables are created
let userOperations, sessionOperations, resumeOperations;

const initializePreparedStatements = () => {
  // User operations
  userOperations = {
    // Create user
    createUser: db.prepare(`
      INSERT INTO users (email, password, firstName, lastName, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `),

    // Get user by email
    getUserByEmail: db.prepare("SELECT * FROM users WHERE email = ? AND status != 'deleted'"),

    // Get user by ID
    getUserById: db.prepare("SELECT * FROM users WHERE id = ? AND status != 'deleted'"),

    // Get all users (admin)
    getAllUsers: db.prepare(`
      SELECT id, email, firstName, lastName, role, status, createdAt, updatedAt, lastLogin 
      FROM users WHERE status != 'deleted' ORDER BY createdAt DESC
    `),

    // Update user
    updateUser: db.prepare(`
      UPDATE users 
      SET firstName = ?, lastName = ?, email = ?, role = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `),

    // Update user password
    updatePassword: db.prepare(`
      UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `),

    // Update last login
    updateLastLogin: db.prepare(`
      UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?
    `),

    // Soft delete user
    deleteUser: db.prepare(`
      UPDATE users SET status = 'deleted', updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `),

    // Suspend user
    suspendUser: db.prepare(`
      UPDATE users SET status = 'suspended', updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `),

    // Activate user
    activateUser: db.prepare(`
      UPDATE users SET status = 'active', updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `)
  };

  // Session operations
  sessionOperations = {
    // Create session
    createSession: db.prepare(`
      INSERT INTO user_sessions (userId, token, expiresAt) VALUES (?, ?, ?)
    `),

    // Get session
    getSession: db.prepare(`
      SELECT * FROM user_sessions WHERE token = ? AND expiresAt > CURRENT_TIMESTAMP
    `),

    // Delete session
    deleteSession: db.prepare('DELETE FROM user_sessions WHERE token = ?'),

    // Delete expired sessions
    cleanExpiredSessions: db.prepare('DELETE FROM user_sessions WHERE expiresAt <= CURRENT_TIMESTAMP'),

    // Delete all user sessions
    deleteUserSessions: db.prepare('DELETE FROM user_sessions WHERE userId = ?')
  };

  // Resume operations
  resumeOperations = {
    // Save resume
    saveResume: db.prepare(`
      INSERT INTO user_resumes (userId, resumeData, title, template)
      VALUES (?, ?, ?, ?)
    `),

    // Update resume
    updateResume: db.prepare(`
      UPDATE user_resumes 
      SET resumeData = ?, title = ?, template = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `),

    // Get user resumes
    getUserResumes: db.prepare(`
      SELECT * FROM user_resumes WHERE userId = ? ORDER BY updatedAt DESC
    `),

    // Get resume by ID
    getResumeById: db.prepare(`
      SELECT * FROM user_resumes WHERE id = ? AND userId = ?
    `),

    // Delete resume
    deleteResume: db.prepare(`
      DELETE FROM user_resumes WHERE id = ? AND userId = ?
    `)
  };
};

// Initialize database
const initializeDatabase = async () => {
  try {
    createTables();
    initializePreparedStatements();
    await createDefaultAdmin();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Clean expired sessions
const cleanExpiredSessions = () => {
  if (sessionOperations) {
    const result = sessionOperations.cleanExpiredSessions.run();
    console.log(`Cleaned ${result.changes} expired sessions`);
  }
};

module.exports = {
  db,
  initializeDatabase,
  cleanExpiredSessions,
  get userOperations() { return userOperations; },
  get sessionOperations() { return sessionOperations; },
  get resumeOperations() { return resumeOperations; }
}; 