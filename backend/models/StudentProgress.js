
import mongoose from 'mongoose';

const StudentProgressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainingMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingMaterial',
        required: true
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started'
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    timeSpent: {
        type: Number,  // in minutes
        default: 0
    },
    quizScore: {
        type: Number,
        min: 0,
        max: 100
    },
    completedAt: {
        type: Date
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure a student can only have one progress record per training material
StudentProgressSchema.index({ student: 1, trainingMaterial: 1 }, { unique: true });

export default mongoose.model('StudentProgress', StudentProgressSchema);
