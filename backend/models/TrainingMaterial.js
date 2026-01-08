
import mongoose from 'mongoose';

const TrainingMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'document', 'quiz', 'assignment'],
        required: true
    },
    fileUrl: {
        type: String
    },
    duration: {
        type: Number  // in minutes
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    tags: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

export default mongoose.model('TrainingMaterial', TrainingMaterialSchema);
