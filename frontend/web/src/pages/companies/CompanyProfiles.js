
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';

const CompanyProfiles = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    isVerified: ''
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/companies');
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (err) {
        setError('Failed to fetch company profiles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...companies];

    if (filters.industry) {
      filtered = filtered.filter(c => c.industry === filters.industry);
    }

    if (filters.isVerified !== '') {
      const isVerified = filters.isVerified === 'true';
      filtered = filtered.filter(c => c.isVerified === isVerified);
    }

    setFilteredCompanies(filtered);
  }, [filters, companies]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      isVerified: ''
    });
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Company Profiles</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Filters</h5>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group controlId="industry">
                <Form.Label>Industry</Form.Label>
                <Form.Select 
                  name="industry" 
                  value={filters.industry} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Industries</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group controlId="isVerified">
                <Form.Label>Verification Status</Form.Label>
                <Form.Select 
                  name="isVerified" 
                  value={filters.isVerified} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Companies</option>
                  <option value="true">Verified Only</option>
                  <option value="false">Unverified Only</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="outline-secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Companies List */}
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredCompanies.length > 0 ? (
        <Row>
          {filteredCompanies.map(company => (
            <Col md={4} className="mb-4" key={company._id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title as="h5">{company.name}</Card.Title>
                    {company.isVerified && (
                      <Badge bg="success" pill>
                        <i className="fas fa-check-circle me-1"></i>
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">{company.industry}</Card.Subtitle>
                  <Card.Text className="text-muted mb-2">
                    {company.description.substring(0, 100)}{company.description.length > 100 ? '...' : ''}
                  </Card.Text>
                  <div className="mb-3">
                    {company.size && (
                      <Badge pill bg="light" text="dark" className="me-2 mb-2">
                        {company.size} employees
                      </Badge>
                    )}
                    {company.headquarters && (
                      <Badge pill bg="light" text="dark" className="me-2 mb-2">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {company.headquarters}
                      </Badge>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {company.founded && `Founded in ${company.founded}`}
                    </small>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewDetails(company)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No company profiles found matching your criteria.
        </Alert>
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCompany.name}
              {selectedCompany.isVerified && (
                <Badge bg="success" pill className="ms-2">
                  <i className="fas fa-check-circle me-1"></i>
                  Verified
                </Badge>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedCompany.industry}</h5>
            <p>{selectedCompany.description}</p>

            <Row className="mb-3">
              {selectedCompany.size && (
                <Col md={6} className="mb-2">
                  <strong>Company Size:</strong> {selectedCompany.size}
                </Col>
              )}
              {selectedCompany.founded && (
                <Col md={6} className="mb-2">
                  <strong>Founded:</strong> {selectedCompany.founded}
                </Col>
              )}
              {selectedCompany.headquarters && (
                <Col md={6} className="mb-2">
                  <strong>Headquarters:</strong> {selectedCompany.headquarters}
                </Col>
              )}
              {selectedCompany.website && (
                <Col md={6} className="mb-2">
                  <strong>Website:</strong> 
                  <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="ms-1">
                    {selectedCompany.website}
                  </a>
                </Col>
              )}
            </Row>

            {selectedCompany.locations && selectedCompany.locations.length > 0 && (
              <div className="mb-3">
                <h6>Locations:</h6>
                <div>
                  {selectedCompany.locations.map((location, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedCompany.contactInfo && (
              <div className="mb-3">
                <h6>Contact Information:</h6>
                <Row>
                  {selectedCompany.contactInfo.email && (
                    <Col md={6} className="mb-2">
                      <strong>Email:</strong> {selectedCompany.contactInfo.email}
                    </Col>
                  )}
                  {selectedCompany.contactInfo.phone && (
                    <Col md={6} className="mb-2">
                      <strong>Phone:</strong> {selectedCompany.contactInfo.phone}
                    </Col>
                  )}
                  {selectedCompany.contactInfo.address && (
                    <Col md={12} className="mb-2">
                      <strong>Address:</strong> {selectedCompany.contactInfo.address}
                    </Col>
                  )}
                </Row>
              </div>
            )}

            {selectedCompany.socialMedia && (
              <div className="mb-3">
                <h6>Social Media:</h6>
                <div>
                  {selectedCompany.socialMedia.linkedin && (
                    <a href={selectedCompany.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="me-3">
                      <i className="fab fa-linkedin fa-lg"></i>
                    </a>
                  )}
                  {selectedCompany.socialMedia.twitter && (
                    <a href={selectedCompany.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="me-3">
                      <i className="fab fa-twitter fa-lg"></i>
                    </a>
                  )}
                  {selectedCompany.socialMedia.facebook && (
                    <a href={selectedCompany.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="me-3">
                      <i className="fab fa-facebook fa-lg"></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            {user.role === 'student' && (
              <Button variant="primary">
                View Job Openings
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default CompanyProfiles;
