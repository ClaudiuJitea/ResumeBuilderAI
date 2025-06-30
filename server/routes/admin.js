const express = require('express');
const bcrypt = require('bcryptjs');
const database = require('../database');
const { authenticateToken, requireAdmin, generateToken, createSession } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users with filtering and pagination
router.get('/users', (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all', role = 'all' } = req.query;
    
    let users = database.userOperations.getAllUsers.all();
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      users = users.filter(user => user.status === status);
    }
    
    // Apply role filter
    if (role !== 'all') {
      users = users.filter(user => user.role === role);
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    // Calculate statistics
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      admins: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length,
    };
    
    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(users.length / limit),
          totalUsers: users.length,
          limit: parseInt(limit)
        },
        stats
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get user by ID
router.get('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = database.userOperations.getUserById.get(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'user' } = req.body;
    
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
    
    // Role validation
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
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
      role,
      'active'
    );
    
    // Get created user (without password)
    const newUser = database.userOperations.getUserById.get(result.lastInsertRowid);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userWithoutPassword }
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, status } = req.body;
    
    // Check if user exists
    const existingUser = database.userOperations.getUserById.get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from changing their own role or status
    if (parseInt(id) === req.user.id) {
      if (role !== req.user.role || status !== req.user.status) {
        return res.status(403).json({
          success: false,
          message: 'Cannot modify your own role or status'
        });
      }
    }
    
    // Validation
    if (!firstName || !lastName || !email || !role || !status) {
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
    
    // Role validation
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    // Status validation
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status specified'
      });
    }
    
    // Check if email is already taken by another user
    const emailUser = database.userOperations.getUserByEmail.get(email);
    if (emailUser && emailUser.id !== parseInt(id)) {
      return res.status(409).json({
        success: false,
        message: 'Email is already taken by another user'
      });
    }
    
    // Update user
    database.userOperations.updateUser.run(firstName, lastName, email, role, status, id);
    
    // Get updated user
    const updatedUser = database.userOperations.getUserById.get(id);
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: userWithoutPassword }
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Delete user (soft delete)
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = database.userOperations.getUserById.get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    // Soft delete user
    database.userOperations.deleteUser.run(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Suspend user
router.patch('/users/:id/suspend', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = database.userOperations.getUserById.get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from suspending themselves
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot suspend your own account'
      });
    }
    
    // Suspend user
    database.userOperations.suspendUser.run(id);
    
    // Get updated user
    const updatedUser = database.userOperations.getUserById.get(id);
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: 'User suspended successfully',
      data: { user: userWithoutPassword }
    });
    
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend user'
    });
  }
});

// Activate user
router.patch('/users/:id/activate', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = database.userOperations.getUserById.get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Activate user
    database.userOperations.activateUser.run(id);
    
    // Get updated user
    const updatedUser = database.userOperations.getUserById.get(id);
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: 'User activated successfully',
      data: { user: userWithoutPassword }
    });
    
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate user'
    });
  }
});

// Reset user password
router.patch('/users/:id/reset-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    // Check if user exists
    const existingUser = database.userOperations.getUserById.get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Validation
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    database.userOperations.updatePassword.run(hashedPassword, id);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', (req, res) => {
  try {
    const users = database.userOperations.getAllUsers.all();
    
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      recentUsers: users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(({ password, ...user }) => user),
      userGrowth: {
        thisMonth: users.filter(u => {
          const userDate = new Date(u.createdAt);
          const now = new Date();
          return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        }).length,
        lastMonth: users.filter(u => {
          const userDate = new Date(u.createdAt);
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return userDate.getMonth() === lastMonth.getMonth() && userDate.getFullYear() === lastMonth.getFullYear();
        }).length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

module.exports = router; 
