# 🚀 ResumeBuilderAI

A modern, AI-powered resume builder application built with React, TypeScript, and Node.js. Create professional resumes in minutes with intelligent content suggestions, CV parsing, and customizable templates.

![ResumeBuilderAI Screenshot](screenshoots/Screenshot01.png)

## ✨ Features

### 🎨 Resume Building
- **Multiple Professional Templates** - Choose from modern and professional designs
- **Real-time Preview** - See changes instantly as you build
- **Drag & Drop Interface** - Intuitive section management
- **Export to PDF** - High-quality PDF generation
- **Responsive Design** - Works on desktop and mobile

### 🤖 AI-Powered Features
- **CV Parsing** - Extract data from existing CVs automatically
- **Content Suggestions** - AI-generated content for each section
- **Text Improvement** - Enhance your writing with AI assistance
- **Job-Tailored Optimization** - Customize resumes for specific roles

### 👥 User Management
- **Secure Authentication** - JWT-based login system
- **User Profiles** - Personal account management
- **Resume Storage** - Save and manage multiple resumes
- **Admin Dashboard** - User and system management

### 🔒 Security & Privacy
- **Environment-based Configuration** - No hardcoded secrets
- **Secure API Key Storage** - Encrypted storage for AI services
- **Rate Limiting** - Protection against abuse
- **Data Privacy** - User data stays secure

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, SQLite
- **Authentication**: JWT with secure session management
- **AI Integration**: OpenRouter API for various AI models
- **PDF Generation**: jsPDF with custom templates
- **Security**: Helmet.js, CORS, Rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/ResumeBuilderAI.git
cd ResumeBuilderAI
npm install
```

### 2. Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# IMPORTANT: Change all default values!
```

**Required Environment Variables:**
```env
# Generate a secure JWT secret (64+ characters)
JWT_SECRET=your-super-secure-jwt-secret-key-for-production

# Admin user configuration
ADMIN_EMAIL=your-admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_FIRST_NAME=Your
ADMIN_LAST_NAME=Name

# Server configuration
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:5173
```

### 3. Initialize Database
```bash
# Set up database with your admin user
npm run reset-db
```

### 4. Start Development
```bash
# Start backend server
npm run server

# In another terminal, start frontend
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/health

## 📖 Detailed Setup

For complete setup instructions including production deployment, security configuration, and AI service setup, see [SETUP.md](SETUP.md).

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start frontend development server
npm run server       # Start backend server
npm run dev:server   # Start backend with auto-reload

# Database
npm run reset-db     # Reset database with fresh schema
npm run migrate-db   # Run database migrations

# Production
npm run build        # Build frontend for production
npm start           # Start production server
```

## 🏗️ Project Structure

```
ResumeBuilderAI/
├── 📁 src/                    # Frontend React application
│   ├── components/           # React components
│   ├── context/             # State management
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
├── 📁 server/                 # Backend Node.js application
│   ├── routes/              # API endpoints
│   ├── middleware/          # Express middleware
│   ├── services/            # Business logic
│   └── database.js          # Database operations
├── 📁 screenshoots/          # Application screenshots
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎯 Usage Guide

### For End Users
1. **Register/Login** - Create your account or sign in
2. **Choose Template** - Select from available designs
3. **Build Resume** - Fill in your information section by section
4. **AI Assistance** - Use AI features for content enhancement
5. **Preview & Export** - Review and download as PDF

### For Administrators
1. **Access Admin Panel** - Login and navigate to admin dashboard
2. **Manage Users** - Create, suspend, or delete user accounts
3. **Configure AI** - Set up API keys for AI services
4. **Monitor Usage** - Track system usage and performance

## 🔐 Security Features

- ✅ **Environment-based Configuration** - No secrets in code
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt for password security
- ✅ **Rate Limiting** - API abuse protection
- ✅ **CORS Protection** - Cross-origin request security
- ✅ **Input Validation** - Sanitized user inputs
- ✅ **Secure Headers** - Helmet.js security headers

## 🤖 AI Integration

The application supports AI-powered features through the OpenRouter API:

1. **Set up OpenRouter Account** at [openrouter.ai](https://openrouter.ai)
2. **Get API Key** from your OpenRouter dashboard
3. **Configure in Admin Panel** - Add your API key securely
4. **Choose AI Model** - Select from available models
5. **Use AI Features** - CV parsing, content suggestions, text improvement

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong, unique JWT secret (64+ characters)
3. Configure production domain in CORS_ORIGINS
4. Set up HTTPS with reverse proxy
5. Enable database backups

### Deployment Steps
```bash
# Build application
npm run build

# Start production server
npm start
```

For detailed production deployment guide, see [SETUP.md](SETUP.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@yourdomain.com
- 📖 **Documentation**: [SETUP.md](SETUP.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ResumeBuilderAI/issues)

## 🙏 Acknowledgments

- Built with ❤️ using React and Node.js
- AI powered by OpenRouter
- Icons by Lucide React
- Styled with Tailwind CSS

---

**⚠️ Security Notice**: Always change default credentials and use environment variables for sensitive configuration. Never commit `.env` files or database files to version control.
