
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch different data based on user role
        if (user.role === 'student') {
          // Fetch student-specific data
          const progressResponse = await axios.get('/training/progress/my');
          const applicationsResponse = await axios.get('/jobs/my/applications');

          setStats({
            materialsInProgress: progressResponse.data.filter(p => p.status === 'in-progress').length,
            materialsCompleted: progressResponse.data.filter(p => p.status === 'completed').length,
            applicationsSubmitted: applicationsResponse.data.length,
            applicationsPending: applicationsResponse.data.filter(a => a.applicationStatus === 'pending').length
          });
        } else if (user.role === 'company') {
          // Fetch company-specific data
          const jobsResponse = await axios.get('/jobs/my/postings');

          setStats({
            totalPostings: jobsResponse.data.length,
            activePostings: jobsResponse.data.filter(j => j.isActive).length,
            totalApplications: jobsResponse.data.reduce((sum, job) => sum + job.applicants.length, 0),
            pendingApplications: jobsResponse.data.reduce((sum, job) => 
              sum + job.applicants.filter(a => a.status === 'pending').length, 0)
          });
        } else if (user.role === 'admin') {
          // Fetch admin-specific data
          const usersResponse = await axios.get('/users');
          const jobsResponse = await axios.get('/jobs');
          const materialsResponse = await axios.get('/training');
          const companiesResponse = await axios.get('/companies');

          setStats({
            totalUsers: usersResponse.data.length,
            totalStudents: usersResponse.data.filter(u => u.role === 'student').length,
            totalCompanies: usersResponse.data.filter(u => u.role === 'company').length,
            totalJobs: jobsResponse.data.length,
            totalMaterials: materialsResponse.data.length,
            verifiedCompanies: companiesResponse.data.filter(c => c.isVerified).length
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const renderStudentDashboard = () => (
    <>
      <h2 className="mb-4">Student Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-primary">{stats?.materialsInProgress || 0}</h3>
              <p className="mb-0">Materials in Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-success">{stats?.materialsCompleted || 0}</h3>
              <p className="mb-0">Materials Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-info">{stats?.applicationsSubmitted || 0}</h3>
              <p className="mb-0">Applications Submitted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-warning">{stats?.applicationsPending || 0}</h3>
              <p className="mb-0">Pending Applications</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderCompanyDashboard = () => (
    <>
      <h2 className="mb-4">Company Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-primary">{stats?.totalPostings || 0}</h3>
              <p className="mb-0">Total Job Postings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-success">{stats?.activePostings || 0}</h3>
              <p className="mb-0">Active Postings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-info">{stats?.totalApplications || 0}</h3>
              <p className="mb-0">Total Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-warning">{stats?.pendingApplications || 0}</h3>
              <p className="mb-0">Pending Applications</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-primary">{stats?.totalUsers || 0}</h3>
              <p className="mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-success">{stats?.totalStudents || 0}</h3>
              <p className="mb-0">Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-info">{stats?.totalCompanies || 0}</h3>
              <p className="mb-0">Companies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-warning">{stats?.verifiedCompanies || 0}</h3>
              <p className="mb-0">Verified Companies</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-primary">{stats?.totalJobs || 0}</h3>
              <p className="mb-0">Total Job Postings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-success">{stats?.totalMaterials || 0}</h3>
              <p className="mb-0">Training Materials</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Welcome, {user.name}!</h1>
        <div className="badge bg-primary fs-6">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {user.role === 'student' && renderStudentDashboard()}
          {user.role === 'company' && renderCompanyDashboard()}
          {user.role === 'admin' && renderAdminDashboard()}
        </>
      )}
    </Container>
  );
};

export default Dashboard;
