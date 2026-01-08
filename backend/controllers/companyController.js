
import CompanyProfile from '../models/CompanyProfile.js';

// Get all company profiles
export const getAllCompanies = async (req, res) => {
    try {
        const { industry, isVerified } = req.query;

        // Build filter object
        const filter = {};
        if (industry) filter.industry = industry;
        if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

        const companies = await CompanyProfile.find(filter)
            .populate('hrContact', 'name email')
            .sort({ createdAt: -1 });

        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get company profile by ID
export const getCompanyById = async (req, res) => {
    try {
        const company = await CompanyProfile.findById(req.params.id)
            .populate('hrContact', 'name email');

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new company profile
export const createCompanyProfile = async (req, res) => {
    try {
        // Only company role users or admins can create company profiles
        if (req.user.role !== 'company' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create company profiles' });
        }

        // Check if user already has a company profile
        const existingProfile = await CompanyProfile.findOne({ hrContact: req.user.id });
        if (existingProfile) {
            return res.status(400).json({ message: 'You already have a company profile' });
        }

        const company = new CompanyProfile({
            ...req.body,
            hrContact: req.user.id
        });

        const newCompany = await company.save();
        await newCompany.populate('hrContact', 'name email');

        res.status(201).json(newCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update company profile
export const updateCompanyProfile = async (req, res) => {
    try {
        const company = await CompanyProfile.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        // Check if user is the HR contact or an admin
        if (company.hrContact.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this company profile' });
        }

        Object.assign(company, req.body);
        company.updatedAt = Date.now();

        const updatedCompany = await company.save();
        await updatedCompany.populate('hrContact', 'name email');

        res.json(updatedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete company profile
export const deleteCompanyProfile = async (req, res) => {
    try {
        const company = await CompanyProfile.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        // Check if user is the HR contact or an admin
        if (company.hrContact.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this company profile' });
        }

        await CompanyProfile.findByIdAndDelete(req.params.id);

        res.json({ message: 'Company profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user's company profile
export const getMyCompanyProfile = async (req, res) => {
    try {
        // Only company users can access this endpoint
        if (req.user.role !== 'company') {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }

        const company = await CompanyProfile.findOne({ hrContact: req.user.id })
            .populate('hrContact', 'name email');

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify company profile (admin only)
export const verifyCompany = async (req, res) => {
    try {
        // Only admins can verify companies
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to verify company profiles' });
        }

        const company = await CompanyProfile.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        company.isVerified = true;
        company.updatedAt = Date.now();

        await company.save();
        await company.populate('hrContact', 'name email');

        res.json({
            message: 'Company profile verified successfully',
            company
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
