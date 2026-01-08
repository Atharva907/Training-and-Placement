
import express from 'express';
import { 
    getAllMaterials, 
    getMaterialById, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial,
    updateProgress,
    getStudentProgress
} from '../controllers/trainingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all training materials (public)
router.get('/', getAllMaterials);

// Get training material by ID (public)
router.get('/:id', getMaterialById);

// Create new training material (protected, trainer or admin)
router.post('/', authenticate, authorize('admin'), createMaterial);

// Update training material (protected, creator or admin)
router.patch('/:id', authenticate, updateMaterial);

// Delete training material (protected, creator or admin)
router.delete('/:id', authenticate, deleteMaterial);

// Update student progress (protected, students only)
router.patch('/:id/progress', authenticate, authorize('student'), updateProgress);

// Get all progress for current student (protected, students only)
router.get('/progress/my', authenticate, authorize('student'), getStudentProgress);

export default router;
