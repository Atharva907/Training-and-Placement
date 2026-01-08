
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Training & Placement Portal</h5>
            <p>
              A comprehensive platform for students to access training materials and apply for placements, 
              while enabling companies to find the right talent.
            </p>
            <div className="d-flex">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3 text-white">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3 text-white">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="me-3 text-white">
                <i className="fab fa-linkedin-in fa-lg"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Quick Links</h5>
            <ListGroup variant="flush" className="bg-transparent">
              <ListGroup.Item action as="a" href="/" className="bg-transparent border-0 text-white ps-0">
                Home
              </ListGroup.Item>
              <ListGroup.Item action as="a" href="/training" className="bg-transparent border-0 text-white ps-0">
                Training
              </ListGroup.Item>
              <ListGroup.Item action as="a" href="/jobs" className="bg-transparent border-0 text-white ps-0">
                Jobs
              </ListGroup.Item>
              <ListGroup.Item action as="a" href="/companies" className="bg-transparent border-0 text-white ps-0">
                Companies
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Resources</h5>
            <ListGroup variant="flush" className="bg-transparent">
              <ListGroup.Item action as="a" href="#" className="bg-transparent border-0 text-white ps-0">
                Documentation
              </ListGroup.Item>
              <ListGroup.Item action as="a" href="#" className="bg-transparent border-0 text-white ps-0">
                Help Center
              </ListGroup.Item>
              <ListGroup.Item action as="a" href="#" className="bg-transparent border-0 text-white ps-0">
                Privacy Policy
              </ListGroup.Item>
              <ListGroup.Item action as="a" href="#" className="bg-transparent border-0 text-white ps-0">
                Terms of Service
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Contact Info</h5>
            <p>
              <i className="fas fa-map-marker-alt me-2"></i>
              123 Education Street, Learning City, 12345
            </p>
            <p>
              <i className="fas fa-phone me-2"></i>
              +1 (123) 456-7890
            </p>
            <p>
              <i className="fas fa-envelope me-2"></i>
              info@trainingplacement.com
            </p>
          </Col>
        </Row>

        <hr className="my-4 bg-white" />

        <Row className="align-items-center">
          <Col md={8}>
            <p className="mb-0">
              &copy; {currentYear} Training & Placement Portal. All Rights Reserved.
            </p>
          </Col>
          <Col md={4} className="text-md-end">
            <p className="mb-0">
              Made with <i className="fas fa-heart text-danger"></i> by Education Team
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
