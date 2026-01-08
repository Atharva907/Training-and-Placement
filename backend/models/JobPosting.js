
import mongoose from 'mongoose';

const JobPostingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry-level', 'mid-level', 'senior-level', 'executive'],
        required: true
    },
    salary: {
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    skillsRequired: [{
        type: String
    }],
    applicationDeadline: {
        type: Date
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'selected'],
            default: 'pending'
        }
    }],
    isActive: {
        type: Boolean,
        default: true
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

export default mongoose.model('JobPosting', JobPostingSchema);
