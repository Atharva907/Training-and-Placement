
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

const TrainingMaterials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    type: ''
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/training');
        setMaterials(response.data);
        setFilteredMaterials(response.data);
      } catch (err) {
        setError('Failed to fetch training materials');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...materials];

    if (filters.category) {
      filtered = filtered.filter(m => m.category === filters.category);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(m => m.difficulty === filters.difficulty);
    }

    if (filters.type) {
      filtered = filtered.filter(m => m.type === filters.type);
    }

    setFilteredMaterials(filtered);
  }, [filters, materials]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      type: ''
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return 'fa-video';
      case 'document':
        return 'fa-file-alt';
      case 'quiz':
        return 'fa-question-circle';
      case 'assignment':
        return 'fa-tasks';
      default:
        return 'fa-book';
    }
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success';
      case 'intermediate':
        return 'bg-warning';
      case 'advanced':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Training Materials</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Filters</h5>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  name="category" 
                  value={filters.category} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="Programming">Programming</option>
                  <option value="Database">Database</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Soft Skills">Soft Skills</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="difficulty">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select 
                  name="difficulty" 
                  value={filters.difficulty} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Select 
                  name="type" 
                  value={filters.type} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
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

      {/* Materials List */}
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <Row>
          {filteredMaterials.map(material => (
            <Col md={4} className="mb-4" key={material._id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title as="h5">{material.title}</Card.Title>
                    <div>
                      <i className={`fas ${getTypeIcon(material.type)} text-primary`}></i>
                    </div>
                  </div>
                  <Card.Text className="text-muted mb-2">
                    {material.description.substring(0, 100)}{material.description.length > 100 ? '...' : ''}
                  </Card.Text>
                  <div className="mb-3">
                    <Badge pill className={`me-2 ${getDifficultyBadgeClass(material.difficulty)}`}>
                      {material.difficulty}
                    </Badge>
                    <Badge pill bg="info">
                      {material.category}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {material.duration ? `${material.duration} min` : ''}
                    </small>
                    <Button variant="outline-primary" size="sm">
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
          No training materials found matching your criteria.
        </Alert>
      )}
    </Container>
  );
};

export default TrainingMaterials;
