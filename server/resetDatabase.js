const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

console.log('🔄 Resetting database...');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

try {
  // Drop all tables if they exist
  console.log('🗑️  Dropping existing tables...');
  
  db.exec(`
    DROP TABLE IF EXISTS user_sessions;
    DROP TABLE IF EXISTS user_resumes;
    DROP TABLE IF EXISTS api_keys;
    DROP TABLE IF EXISTS users;
  `);

  // Recreate tables
  console.log('🔧 Creating fresh tables...');
  
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      status VARCHAR(50) DEFAULT 'active',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      lastLogin TIMESTAMP
    );

    CREATE TABLE user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token VARCHAR(255) UNIQUE NOT NULL,
      expiresAt TIMESTAMP NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE user_resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      resumeData TEXT NOT NULL,
      title VARCHAR(255),
      template VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service VARCHAR(50) NOT NULL,
      apiKey VARCHAR(255) NOT NULL,
      selectedModel VARCHAR(100) DEFAULT 'anthropic/claude-3.5-sonnet',
      isActive INTEGER DEFAULT 1,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create default admin user
  console.log('👤 Creating default admin user...');
  
  const hashedPassword = bcrypt.hashSync('admin123', 12);
  const createAdmin = db.prepare(`
    INSERT INTO users (email, password, firstName, lastName, role)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  createAdmin.run('admin@resumeai.com', hashedPassword, 'Admin', 'User', 'admin');

  console.log('✅ Database reset completed successfully!');
  console.log('🔑 Default admin credentials: admin@resumeai.com / admin123');
  
} catch (error) {
  console.error('❌ Database reset failed:', error);
  process.exit(1);
} finally {
  db.close();
  process.exit(0);
} 