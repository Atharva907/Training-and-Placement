
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

const JobPostings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    experienceLevel: '',
    location: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        setError('Failed to fetch job postings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...jobs];

    if (filters.jobType) {
      filtered = filtered.filter(j => j.jobType === filters.jobType);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(j => j.experienceLevel === filters.experienceLevel);
    }

    if (filters.location) {
      filtered = filtered.filter(j => 
        j.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      jobType: '',
      experienceLevel: '',
      location: ''
    });
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const handleApplyForJob = async (jobId) => {
    try {
      setApplying(true);
      await axios.post(`/jobs/${jobId}/apply`);

      // Update the job in the state to reflect the application
      const updatedJobs = jobs.map(job => {
        if (job._id === jobId) {
          return {
            ...job,
            applicants: [...job.applicants, { student: user.id, status: 'pending' }]
          };
        }
        return job;
      });

      setJobs(updatedJobs);
      handleCloseModal();

      // Show success message
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const hasAlreadyApplied = (job) => {
    return job.applicants.some(applicant => 
      applicant.student.toString() === user.id
    );
  };

  const getJobTypeBadgeClass = (jobType) => {
    switch (jobType) {
      case 'full-time':
        return 'bg-primary';
      case 'part-time':
        return 'bg-info';
      case 'internship':
        return 'bg-success';
      case 'contract':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const getExperienceLevelBadgeClass = (experienceLevel) => {
    switch (experienceLevel) {
      case 'entry-level':
        return 'bg-success';
      case 'mid-level':
        return 'bg-info';
      case 'senior-level':
        return 'bg-warning';
      case 'executive':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Job Postings</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Filters</h5>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="jobType">
                <Form.Label>Job Type</Form.Label>
                <Form.Select 
                  name="jobType" 
                  value={filters.jobType} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="experienceLevel">
                <Form.Label>Experience Level</Form.Label>
                <Form.Select 
                  name="experienceLevel" 
                  value={filters.experienceLevel} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Levels</option>
                  <option value="entry-level">Entry-level</option>
                  <option value="mid-level">Mid-level</option>
                  <option value="senior-level">Senior-level</option>
                  <option value="executive">Executive</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control 
                  type="text" 
                  name="location" 
                  value={filters.location} 
                  onChange={handleFilterChange}
                  placeholder="Enter location"
                />
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

      {/* Jobs List */}
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredJobs.length > 0 ? (
        <Row>
          {filteredJobs.map(job => (
            <Col md={4} className="mb-4" key={job._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title as="h5">{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                  <Card.Text className="text-muted mb-2">
                    {job.description.substring(0, 100)}{job.description.length > 100 ? '...' : ''}
                  </Card.Text>
                  <div className="mb-3">
                    <Badge pill className={`me-2 ${getJobTypeBadgeClass(job.jobType)}`}>
                      {job.jobType}
                    </Badge>
                    <Badge pill className={`me-2 ${getExperienceLevelBadgeClass(job.experienceLevel)}`}>
                      {job.experienceLevel}
                    </Badge>
                    <Badge pill bg="secondary">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {job.location}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {job.salary.min && job.salary.max && 
                        `$${job.salary.min} - $${job.salary.max}`}
                    </small>
                    <div>
                      {user.role === 'student' && (
                        hasAlreadyApplied(job) ? (
                          <Button variant="success" size="sm" disabled>
                            Applied
                          </Button>
                        ) : (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewDetails(job)}
                          >
                            Apply Now
                          </Button>
                        )
                      )}
                      {user.role === 'company' || user.role === 'admin' ? (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewDetails(job)}
                        >
                          View Details
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No job postings found matching your criteria.
        </Alert>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedJob.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedJob.company}</h5>
            <div className="mb-3">
              <Badge pill className={`me-2 ${getJobTypeBadgeClass(selectedJob.jobType)}`}>
                {selectedJob.jobType}
              </Badge>
              <Badge pill className={`me-2 ${getExperienceLevelBadgeClass(selectedJob.experienceLevel)}`}>
                {selectedJob.experienceLevel}
              </Badge>
              <Badge pill bg="secondary">
                <i className="fas fa-map-marker-alt me-1"></i>
                {selectedJob.location}
              </Badge>
            </div>

            {selectedJob.salary.min && selectedJob.salary.max && (
              <p className="mb-3">
                <strong>Salary:</strong> ${selectedJob.salary.min} - ${selectedJob.salary.max} {selectedJob.salary.currency}
              </p>
            )}

            <div className="mb-3">
              <h6>Job Description:</h6>
              <p>{selectedJob.description}</p>
            </div>

            {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
              <div className="mb-3">
                <h6>Skills Required:</h6>
                <div>
                  {selectedJob.skillsRequired.map((skill, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedJob.applicationDeadline && (
              <p className="mb-3">
                <strong>Application Deadline:</strong> {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            {user.role === 'student' && !hasAlreadyApplied(selectedJob) && (
              <Button 
                variant="primary" 
                onClick={() => handleApplyForJob(selectedJob._id)}
                disabled={applying}
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
            {user.role === 'student' && hasAlreadyApplied(selectedJob) && (
              <Button variant="success" disabled>
                Applied
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default JobPostings;
