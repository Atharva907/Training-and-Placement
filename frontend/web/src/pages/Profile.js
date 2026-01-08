
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.patch(`/users/${user.id}`, profileData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await axios.patch(`/users/${user.id}`, {
        password: passwordData.newPassword
      });

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setPasswordSuccess('Password updated successfully!');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">My Profile</h1>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-2 fw-bold">
                    {profileData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <h4>{profileData.name}</h4>
              <Badge pill bg="primary" className="mb-3">
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </Badge>
              <p className="text-muted">{profileData.email}</p>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Edit Profile</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={profileData.role}
                    onChange={handleProfileChange}
                    disabled={user.role !== 'admin'} // Only admins can change roles
                  >
                    <option value="student">Student</option>
                    <option value="company">Company Representative</option>
                    <option value="admin">Administrator</option>
                  </Form.Select>
                  {user.role !== 'admin' && (
                    <Form.Text className="text-muted">
                      Only administrators can change user roles.
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header as="h5">Change Password</Card.Header>
            <Card.Body>
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
              {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}

              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
