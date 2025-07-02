# ResumeBuilderAI - Secure Setup Guide

## 🚀 Features Implemented

### ✅ Complete Authentication System
- **User Registration & Login** with JWT tokens
- **Password hashing** with bcryptjs
- **Session management** with SQLite database
- **Role-based access control** (User/Admin)
- **Rate limiting** for security

### ✅ Admin Dashboard
- **User Management**: Create, delete, suspend, activate users
- **User Statistics**: Total, active, suspended users
- **Search & Filter**: Find users by name, email, status, role
- **API Key Management**: Secure storage for AI service keys
- **Monochrome Icons**: Clean, consistent UI design

### ✅ Database Schema (SQLite)
- **Users table**: Complete user profiles with roles and status
- **Sessions table**: JWT token management
- **User resumes table**: Link resumes to users
- **API keys table**: Secure encrypted storage for AI service keys

### ✅ Security Features
- **Environment-based configuration** (no hardcoded secrets)
- **JWT authentication** with configurable expiration
- **Password validation** (minimum 6 characters)
- **Rate limiting** (100 requests per 15 minutes)
- **CORS protection** and security headers
- **Session cleanup** (automatic expired session removal)
- **Database files excluded from git** for security

## 🛠️ Secure Setup Instructions

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd ResumeBuilderAI

# Install all dependencies
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your secure values
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```env
# IMPORTANT: Generate a secure JWT secret (at least 64 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-for-production-at-least-64-characters-long

# Node environment
NODE_ENV=development

# Server port
PORT=3001

# Database path
DATABASE_PATH=./database.sqlite

# Admin user (change these immediately!)
ADMIN_EMAIL=your-admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_FIRST_NAME=Your
ADMIN_LAST_NAME=Name

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup
```bash
# Initialize/reset the database with your admin user
npm run reset-db

# Or migrate existing database
npm run migrate-db
```

### 4. Start the Application
```bash
# Start the backend server
npm run server

# In a new terminal, start the frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔐 Security Best Practices

### For Development
1. **Never commit `.env` files** (already in .gitignore)
2. **Use different JWT secrets** for different environments
3. **Change default admin credentials** immediately after setup
4. **Database files are excluded** from git for security

### For Production
1. **Use a strong JWT secret** (64+ characters, random)
2. **Set NODE_ENV=production**
3. **Use HTTPS** for all connections
4. **Update CORS_ORIGINS** to your production domain
5. **Use environment variables** for all sensitive data
6. **Enable database backups**
7. **Use a reverse proxy** (nginx/Apache) for the frontend

## 📁 Project Structure

```
ResumeBuilderAI/
├── .env.example               # Example environment configuration
├── .gitignore                 # Excludes sensitive files
├── server/                    # Backend Express server
│   ├── database.js           # SQLite database setup & operations
│   ├── server.js             # Main server file (env-configured)
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── routes/
│       ├── auth.js           # Authentication routes
│       ├── admin.js          # Admin management routes
│       ├── ai.js             # AI service routes
│       └── cvs.js            # Resume management routes
├── src/
│   ├── components/
│   │   ├── auth/             # Authentication components
│   │   ├── admin/            # Admin dashboard & API key management
│   │   └── ...               # Other components
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication state management
│   └── types/
│       └── auth.ts           # TypeScript interfaces
└── database.sqlite           # SQLite database (excluded from git)
```

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /logout-all` - Logout from all devices
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /verify` - Verify JWT token

### Admin Routes (`/api/admin`) - Admin Only
- `GET /users` - Get all users (with pagination, search, filters)
- `POST /users` - Create new user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/suspend` - Suspend user
- `PATCH /users/:id/activate` - Activate user
- `GET /api-keys` - Get stored API keys
- `POST /api-keys` - Store new API key
- `DELETE /api-keys/:service` - Delete API key

## 🎯 Initial Setup & Usage

### First-Time Setup:
1. **Configure environment** variables in `.env`
2. **Run database setup**: `npm run reset-db`
3. **Start the application**: `npm run server` & `npm run dev`
4. **Login as admin** with your configured credentials
5. **Change admin password** immediately after first login
6. **Configure AI service API keys** in the admin dashboard

### For Regular Users:
1. **Register** a new account or **login** with existing credentials
2. Build your resume using the resume builder
3. **Upload and parse CVs** using AI assistance
4. **Generate optimized content** with AI suggestions

### For Admins:
1. **Login** with admin credentials
2. Click **"Admin"** button in the navigation
3. **Manage users** and **configure API keys**
4. **Monitor system usage** and **maintain security**

## 🚦 Production Deployment

### Environment Setup
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-min-64-chars
PORT=3001
DATABASE_PATH=./database.sqlite
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-production-admin-password
CORS_ORIGINS=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Build & Deploy
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🔒 Security Features Implemented

- ✅ **No hardcoded secrets** (all environment-based)
- ✅ **Database files excluded** from version control
- ✅ **Secure password hashing** with bcrypt
- ✅ **JWT token management** with database sessions
- ✅ **Rate limiting** and CORS protection
- ✅ **Input validation** and sanitization
- ✅ **Secure headers** with Helmet.js
- ✅ **Environment-based configuration**

The application is now production-ready with proper security measures! 🔐✨ 