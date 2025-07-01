const Database = require('better-sqlite3');
const path = require('path');

console.log('🔄 Migrating database...');

// Connect to existing database
const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
  // Check if selectedModel column exists
  const tableInfo = db.prepare("PRAGMA table_info(api_keys)").all();
  const hasSelectedModelColumn = tableInfo.some(column => column.name === 'selectedModel');
  
  if (!hasSelectedModelColumn) {
    console.log('📝 Adding selectedModel column to api_keys table...');
    
    // Add the new column with a default value
    db.exec(`
      ALTER TABLE api_keys 
      ADD COLUMN selectedModel TEXT DEFAULT 'anthropic/claude-3.5-sonnet'
    `);
    
    console.log('✅ selectedModel column added successfully!');
  } else {
    console.log('ℹ️  selectedModel column already exists');
  }
  
  console.log('✅ Database migration completed successfully!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  
  // If api_keys table doesn't exist, create it
  if (error.message.includes('no such table: api_keys')) {
    console.log('📝 Creating api_keys table...');
    db.exec(`
      CREATE TABLE api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service TEXT NOT NULL UNIQUE,
        apiKey TEXT NOT NULL,
        selectedModel TEXT DEFAULT 'anthropic/claude-3.5-sonnet',
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ api_keys table created successfully!');
  }
} finally {
  db.close();
}

console.log('🎉 Migration complete! You can now restart your server.');
process.exit(0); 