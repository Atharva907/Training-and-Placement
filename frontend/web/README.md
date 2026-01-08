# Training and Placement Portal - Web Frontend

This is the web frontend for the Training and Placement Application, built with React.js.

## Features

- User authentication (login, register)
- Dashboard with role-based views
- Training materials browsing and progress tracking
- Job postings search and application
- Company profiles viewing
- User profile management

## Technologies Used

- React.js
- React Router for navigation
- Bootstrap for UI components
- Axios for API requests
- Context API for state management

## Getting Started

### Prerequisites

- Node.js and npm installed
- Backend server running on http://localhost:5000

### Installation

1. Clone the repository
2. Navigate to the frontend/web directory
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

Start the development server:
```
npm start
```

The application will open in your default browser at http://localhost:3000.

### Building for Production

To create an optimized production build:
```
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
├── context/         # Context providers for state management
├── pages/           # Page components
│   ├── auth/        # Authentication pages
│   ├── training/    # Training materials pages
│   ├── jobs/        # Job postings pages
│   └── companies/   # Company profiles pages
└── App.js           # Main app component with routing
```

## API Integration

The frontend communicates with the backend API through Axios. The API base URL is set in the AuthContext, and can be configured through the REACT_APP_API_URL environment variable.

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and included in the Authorization header for all API requests.

## Role-Based Access

The application supports three user roles:
- Student: Can view training materials, track progress, and apply for jobs
- Company: Can post jobs and manage applications
- Admin: Can manage all aspects of the system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request