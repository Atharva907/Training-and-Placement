
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        // Find user by id
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};
