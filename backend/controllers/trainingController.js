
import TrainingMaterial from '../models/TrainingMaterial.js';
import StudentProgress from '../models/StudentProgress.js';

// Get all training materials
export const getAllMaterials = async (req, res) => {
    try {
        const { category, difficulty, type } = req.query;

        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (type) filter.type = type;

        const materials = await TrainingMaterial.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get training material by ID
export const getMaterialById = async (req, res) => {
    try {
        const material = await TrainingMaterial.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!material) {
            return res.status(404).json({ message: 'Training material not found' });
        }

        // If user is a student, check if they have progress for this material
        if (req.user.role === 'student') {
            const progress = await StudentProgress.findOne({
                student: req.user.id,
                trainingMaterial: req.params.id
            });

            return res.json({
                material,
                progress: progress || null
            });
        }

        res.json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new training material
export const createMaterial = async (req, res) => {
    try {
        const material = new TrainingMaterial({
            ...req.body,
            createdBy: req.user.id
        });

        const newMaterial = await material.save();
        await newMaterial.populate('createdBy', 'name email');

        res.status(201).json(newMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update training material
export const updateMaterial = async (req, res) => {
    try {
        const material = await TrainingMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Training material not found' });
        }

        // Check if user is the creator or an admin
        if (material.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this material' });
        }

        Object.assign(material, req.body);
        material.updatedAt = Date.now();

        const updatedMaterial = await material.save();
        await updatedMaterial.populate('createdBy', 'name email');

        res.json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete training material
export const deleteMaterial = async (req, res) => {
    try {
        const material = await TrainingMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Training material not found' });
        }

        // Check if user is the creator or an admin
        if (material.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this material' });
        }

        await TrainingMaterial.findByIdAndDelete(req.params.id);

        // Also delete any student progress records for this material
        await StudentProgress.deleteMany({ trainingMaterial: req.params.id });

        res.json({ message: 'Training material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update student progress
export const updateProgress = async (req, res) => {
    try {
        const { status, progressPercentage, timeSpent, quizScore, notes } = req.body;

        // Find or create progress record
        let progress = await StudentProgress.findOne({
            student: req.user.id,
            trainingMaterial: req.params.id
        });

        if (!progress) {
            progress = new StudentProgress({
                student: req.user.id,
                trainingMaterial: req.params.id
            });
        }

        // Update progress fields
        if (status) progress.status = status;
        if (progressPercentage !== undefined) progress.progressPercentage = progressPercentage;
        if (timeSpent !== undefined) progress.timeSpent = timeSpent;
        if (quizScore !== undefined) progress.quizScore = quizScore;
        if (notes !== undefined) progress.notes = notes;

        // If status is completed, set completedAt
        if (status === 'completed' && !progress.completedAt) {
            progress.completedAt = Date.now();
        }

        progress.updatedAt = Date.now();

        await progress.save();
        await progress.populate('trainingMaterial', 'title type');

        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all progress for current student
export const getStudentProgress = async (req, res) => {
    try {
        const progress = await StudentProgress.find({ student: req.user.id })
            .populate('trainingMaterial', 'title type category difficulty')
            .sort({ updatedAt: -1 });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
