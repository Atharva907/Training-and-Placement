
import mongoose from 'mongoose';

const CompanyProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    logo: {
        type: String  // URL to company logo
    },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    founded: {
        type: Number  // Year founded
    },
    headquarters: {
        type: String
    },
    locations: [{
        type: String
    }],
    contactInfo: {
        email: {
            type: String
        },
        phone: {
            type: String
        },
        address: {
            type: String
        }
    },
    socialMedia: {
        linkedin: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        }
    },
    hrContact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
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

export default mongoose.model('CompanyProfile', CompanyProfileSchema);
