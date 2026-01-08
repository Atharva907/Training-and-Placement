# Backend API

This directory contains the backend API and services for the Training and Placement Application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (protected)
- `PATCH /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (admin only)

### Training Materials
- `GET /api/training` - Get all training materials (public)
- `GET /api/training/:id` - Get training material by ID (public)
- `POST /api/training` - Create new training material (admin only)
- `PATCH /api/training/:id` - Update training material (creator or admin)
- `DELETE /api/training/:id` - Delete training material (creator or admin)
- `PATCH /api/training/:id/progress` - Update student progress (students only)
- `GET /api/training/progress/my` - Get all progress for current student (students only)

### Job Postings
- `GET /api/jobs` - Get all job postings (public)
- `GET /api/jobs/:id` - Get job posting by ID (public)
- `POST /api/jobs` - Create new job posting (company or admin)
- `PATCH /api/jobs/:id` - Update job posting (poster or admin)
- `DELETE /api/jobs/:id` - Delete job posting (poster or admin)
- `POST /api/jobs/:id/apply` - Apply for a job (students only)
- `PATCH /api/jobs/:id/applications/:studentId` - Update application status (poster or admin)
- `GET /api/jobs/my/postings` - Get jobs posted by current user (company or admin)
- `GET /api/jobs/my/applications` - Get jobs applied by current student (students only)

### Company Profiles
- `GET /api/companies` - Get all company profiles (public)
- `GET /api/companies/:id` - Get company profile by ID (public)
- `POST /api/companies` - Create new company profile (company or admin)
- `PATCH /api/companies/:id` - Update company profile (HR contact or admin)
- `DELETE /api/companies/:id` - Delete company profile (HR contact or admin)
- `GET /api/companies/my/profile` - Get current user's company profile (company users only)
- `PATCH /api/companies/:id/verify` - Verify company profile (admin only)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

The system supports the following user roles:
- `student` - Default role for new users
- `company` - Company representatives
- `admin` - System administrators

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
- Set your MongoDB connection string
- Generate a secure JWT secret

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Project Structure

- `controllers/` - Route controllers
- `middleware/` - Custom middleware
- `models/` - Mongoose models
- `routes/` - API routes
- `server.js` - Main server file