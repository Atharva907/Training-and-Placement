
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <Container>
          <h1 className="display-4 fw-bold mb-4">Welcome to Training & Placement Portal</h1>
          <p className="lead mb-5">
            Your gateway to skill development and career opportunities
          </p>
          {!isAuthenticated && (
            <div>
              <Button as={Link} to="/register" variant="light" size="lg" className="me-3">
                Get Started
              </Button>
              <Button as={Link} to="/login" variant="outline-light" size="lg">
                Login
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <Button as={Link} to="/dashboard" variant="light" size="lg">
              Go to Dashboard
            </Button>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Our Features</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center p-4">
                <div className="feature-icon mx-auto">
                  <i className="fas fa-book-open"></i>
                </div>
                <Card.Body>
                  <Card.Title as="h3">Training Materials</Card.Title>
                  <Card.Text>
                    Access a wide range of training materials including videos, documents, quizzes, and assignments to enhance your skills.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center p-4">
                <div className="feature-icon mx-auto">
                  <i className="fas fa-briefcase"></i>
                </div>
                <Card.Body>
                  <Card.Title as="h3">Job Opportunities</Card.Title>
                  <Card.Text>
                    Discover and apply for job opportunities from top companies looking for talented candidates like you.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center p-4">
                <div className="feature-icon mx-auto">
                  <i className="fas fa-chart-line"></i>
                </div>
                <Card.Body>
                  <Card.Title as="h3">Progress Tracking</Card.Title>
                  <Card.Text>
                    Track your learning progress, quiz scores, and application status all in one place.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4 fw-bold">1</span>
                </div>
                <h4>Register</h4>
                <p>Create your account with your email and choose your role (student, company, or admin).</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4 fw-bold">2</span>
                </div>
                <h4>Learn & Apply</h4>
                <p>Access training materials to enhance your skills and apply for jobs that match your profile.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4 fw-bold">3</span>
                </div>
                <h4>Get Hired</h4>
                <p>Track your applications and get hired by top companies looking for talented professionals.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-5 bg-primary text-white text-center">
          <Container>
            <h2 className="mb-4">Ready to Start Your Journey?</h2>
            <p className="lead mb-4">
              Join thousands of students who have already benefited from our platform.
            </p>
            <Button as={Link} to="/register" variant="light" size="lg">
              Sign Up Now
            </Button>
          </Container>
        </section>
      )}
    </div>
  );
};

export default Home;
