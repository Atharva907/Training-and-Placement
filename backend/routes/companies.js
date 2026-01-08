
import express from 'express';
import { 
    getAllCompanies, 
    getCompanyById, 
    createCompanyProfile, 
    updateCompanyProfile, 
    deleteCompanyProfile,
    getMyCompanyProfile,
    verifyCompany
} from '../controllers/companyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all company profiles (public)
router.get('/', getAllCompanies);

// Get company profile by ID (public)
router.get('/:id', getCompanyById);

// Create new company profile (protected, company or admin)
router.post('/', authenticate, authorize('company', 'admin'), createCompanyProfile);

// Update company profile (protected, HR contact or admin)
router.patch('/:id', authenticate, updateCompanyProfile);

// Delete company profile (protected, HR contact or admin)
router.delete('/:id', authenticate, deleteCompanyProfile);

// Get current user's company profile (protected, company users only)
router.get('/my/profile', authenticate, authorize('company'), getMyCompanyProfile);

// Verify company profile (protected, admin only)
router.patch('/:id/verify', authenticate, authorize('admin'), verifyCompany);

export default router;
