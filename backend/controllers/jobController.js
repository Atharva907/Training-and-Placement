
import JobPosting from '../models/JobPosting.js';

// Get all job postings
export const getAllJobs = async (req, res) => {
    try {
        const { 
            jobType, 
            experienceLevel, 
            location, 
            company,
            skills,
            isActive = true 
        } = req.query;

        // Build filter object
        const filter = { isActive: isActive === 'true' };

        if (jobType) filter.jobType = jobType;
        if (experienceLevel) filter.experienceLevel = experienceLevel;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (company) filter.company = { $regex: company, $options: 'i' };
        if (skills) {
            const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
            filter.skillsRequired = { $in: skillsArray };
        }

        const jobs = await JobPosting.find(filter)
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get job posting by ID
export const getJobById = async (req, res) => {
    try {
        const job = await JobPosting.findById(req.params.id)
            .populate('postedBy', 'name email')
            .populate('applicants.student', 'name email');

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new job posting
export const createJob = async (req, res) => {
    try {
        // Only company role users or admins can create job postings
        if (req.user.role !== 'company' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create job postings' });
        }

        const job = new JobPosting({
            ...req.body,
            postedBy: req.user.id
        });

        const newJob = await job.save();
        await newJob.populate('postedBy', 'name email');

        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update job posting
export const updateJob = async (req, res) => {
    try {
        const job = await JobPosting.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        // Check if user is the poster or an admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this job posting' });
        }

        Object.assign(job, req.body);
        job.updatedAt = Date.now();

        const updatedJob = await job.save();
        await updatedJob.populate('postedBy', 'name email');

        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete job posting
export const deleteJob = async (req, res) => {
    try {
        const job = await JobPosting.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        // Check if user is the poster or an admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this job posting' });
        }

        await JobPosting.findByIdAndDelete(req.params.id);

        res.json({ message: 'Job posting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Apply for a job
export const applyForJob = async (req, res) => {
    try {
        // Only students can apply for jobs
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can apply for jobs' });
        }

        const job = await JobPosting.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        // Check if job is active
        if (!job.isActive) {
            return res.status(400).json({ message: 'This job posting is no longer active' });
        }

        // Check if application deadline has passed
        if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
            return res.status(400).json({ message: 'Application deadline has passed' });
        }

        // Check if student has already applied
        const alreadyApplied = job.applicants.some(
            applicant => applicant.student.toString() === req.user.id
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Add student to applicants list
        job.applicants.push({
            student: req.user.id,
            appliedAt: Date.now(),
            status: 'pending'
        });

        await job.save();
        await job.populate('applicants.student', 'name email');

        res.json({ 
            message: 'Application submitted successfully',
            application: job.applicants.find(
                applicant => applicant.student.toString() === req.user.id
            )
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update application status (for company users and admins)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { studentId, status } = req.body;

        // Only company users who posted the job or admins can update application status
        const job = await JobPosting.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update application status' });
        }

        // Find and update the application
        const application = job.applicants.find(
            applicant => applicant.student.toString() === studentId
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;

        await job.save();
        await job.populate('applicants.student', 'name email');

        res.json({
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get jobs posted by current user (for company users)
export const getMyJobs = async (req, res) => {
    try {
        // Only company users can access this endpoint
        if (req.user.role !== 'company' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }

        const jobs = await JobPosting.find({ postedBy: req.user.id })
            .populate('applicants.student', 'name email')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get jobs applied by current student
export const getAppliedJobs = async (req, res) => {
    try {
        // Only students can access this endpoint
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }

        // Find all jobs where the current student has applied
        const jobs = await JobPosting.find({ 
            'applicants.student': req.user.id 
        })
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 });

        // Extract application status for each job
        const jobsWithStatus = jobs.map(job => {
            const application = job.applicants.find(
                applicant => applicant.student.toString() === req.user.id
            );

            return {
                ...job.toObject(),
                applicationStatus: application.status,
                appliedAt: application.appliedAt
            };
        });

        res.json(jobsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
