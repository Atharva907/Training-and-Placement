
import express from 'express';
import { 
    getAllJobs, 
    getJobById, 
    createJob, 
    updateJob, 
    deleteJob,
    applyForJob,
    updateApplicationStatus,
    getMyJobs,
    getAppliedJobs
} from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all job postings (public)
router.get('/', getAllJobs);

// Get job posting by ID (public)
router.get('/:id', getJobById);

// Create new job posting (protected, company or admin)
router.post('/', authenticate, authorize('company', 'admin'), createJob);

// Update job posting (protected, poster or admin)
router.patch('/:id', authenticate, updateJob);

// Delete job posting (protected, poster or admin)
router.delete('/:id', authenticate, deleteJob);

// Apply for a job (protected, students only)
router.post('/:id/apply', authenticate, authorize('student'), applyForJob);

// Update application status (protected, company who posted or admin)
router.patch('/:id/applications/:studentId', authenticate, updateApplicationStatus);

// Get jobs posted by current user (protected, company users)
router.get('/my/postings', authenticate, authorize('company', 'admin'), getMyJobs);

// Get jobs applied by current student (protected, students only)
router.get('/my/applications', authenticate, authorize('student'), getAppliedJobs);

export default router;
