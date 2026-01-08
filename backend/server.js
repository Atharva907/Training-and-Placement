import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import trainingRouter from './routes/training.js';
import jobsRouter from './routes/jobs.js';
import companiesRouter from './routes/companies.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://atharvachavan907_db_user:0bfJh7s5T15lTeS5@cluster0.rkcqqgq.mongodb.net/?appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/training', trainingRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/companies', companiesRouter);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Training and Placement API is running...');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});