# ResumeAI Authentication System Setup

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
- **Monochrome Icons**: Clean, consistent UI design

### ✅ Database Schema (SQLite)
- **Users table**: Complete user profiles with roles and status
- **Sessions table**: JWT token management
- **User resumes table**: Link resumes to users (ready for future)

### ✅ Security Features
- **JWT authentication** with 7-day expiration
- **Password validation** (minimum 6 characters)
- **Rate limiting** (5 attempts per 15 minutes)
- **CORS protection** and security headers
- **Session cleanup** (automatic expired session removal)

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
# Install all dependencies (already done)
npm install
```

### 2. Start the Backend Server
```bash
# Start the Express server (SQLite database will be created automatically)
npm run server

# Or for development with auto-restart
npm run dev:server
```

### 3. Start the Frontend
```bash
# In a new terminal, start the Vite development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔐 Default Admin Credentials

```
Email: admin@resumeai.com
Password: admin123
```

## 📁 Project Structure

```
ResumeAI/
├── server/                     # Backend Express server
│   ├── database.js            # SQLite database setup & operations
│   ├── server.js              # Main server file
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   └── routes/
│       ├── auth.js            # Authentication routes
│       └── admin.js           # Admin management routes
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── AuthPage.tsx   # Login/Register page
│   │   │   ├── LoginForm.tsx  # Login form
│   │   │   └── RegisterForm.tsx # Registration form
│   │   └── admin/
│   │       └── AdminDashboard.tsx # Admin user management
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication state management
│   └── types/
│       └── auth.ts            # TypeScript interfaces
└── database.sqlite            # SQLite database (auto-created)
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
- `DELETE /users/:id` - Delete user (soft delete)
- `PATCH /users/:id/suspend` - Suspend user
- `PATCH /users/:id/activate` - Activate user

## 🎯 How to Use

### For Regular Users:
1. **Register** a new account or **login** with existing credentials
2. Build your resume using the existing resume builder
3. **Logout** when finished

### For Admins:
1. **Login** with admin credentials (admin@resumeai.com / admin123)
2. Click **"Admin"** button in the navigation
3. **Manage users**:
   - View user statistics
   - Search and filter users
   - Create new users
   - Suspend/activate users
   - Delete users
4. **Return to app** or **logout**

## 🔄 Database Migration Path

The SQLite database is designed for **easy migration to Supabase**:

1. **Current**: SQLite with better-sqlite3
2. **Future**: Simply change connection string to Supabase PostgreSQL
3. **Schema**: Compatible with PostgreSQL (just change AUTO_INCREMENT to SERIAL)

## 🚦 Production Deployment

### Environment Variables
Create a `.env` file in the server directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
PORT=3001
```

### Build Commands
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🔐 Security Notes

- **Change JWT_SECRET** in production
- **Use HTTPS** in production
- **Update CORS origins** for your domain
- **Set strong admin password**
- **Enable database backups**

## 🎨 UI Features

- **Monochrome icons** throughout admin interface
- **Responsive design** for mobile and desktop
- **Loading states** and error handling
- **Modern UI** with Tailwind CSS
- **Consistent theming** with existing app

The authentication system is now fully integrated and ready to use! 🎉 