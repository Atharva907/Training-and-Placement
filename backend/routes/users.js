import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (protected route, admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by ID (protected route)
router.get('/:id', authenticate, async (req, res) => {
    try {
        // Users can only access their own profile unless they're admin
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user (protected route)
router.patch('/:id', authenticate, async (req, res) => {
    try {
        // Users can only update their own profile unless they're admin
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Only admins can change roles
        if (req.body.role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can change user roles' });
        }
        
        // Update fields
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.role && req.user.role === 'admin') user.role = req.body.role;
        
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user (protected route, admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;