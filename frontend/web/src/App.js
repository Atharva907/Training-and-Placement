
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import TrainingMaterials from './pages/training/TrainingMaterials';
import JobPostings from './pages/jobs/JobPostings';
import CompanyProfiles from './pages/companies/CompanyProfiles';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path="/training" element={
                <PrivateRoute>
                  <TrainingMaterials />
                </PrivateRoute>
              } />

              <Route path="/jobs" element={
                <PrivateRoute>
                  <JobPostings />
                </PrivateRoute>
              } />

              <Route path="/companies" element={
                <PrivateRoute>
                  <CompanyProfiles />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
