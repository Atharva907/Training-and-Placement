import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect('mongodb+srv://atharvachavan907_db_user:0bfJh7s5T15lTeS5@cluster0.rkcqqgq.mongodb.net/?appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', usersRouter);