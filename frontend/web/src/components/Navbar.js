
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar as BSNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const closeNav = () => setExpanded(false);

  return (
    <BSNavbar bg="light" expand="lg" expanded={expanded} className="shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" onClick={closeNav}>
          <i className="fas fa-graduation-cap me-2 text-primary"></i>
          Training & Placement
        </BSNavbar.Brand>
        <BSNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={closeNav}>
              Home
            </Nav.Link>

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard" onClick={closeNav}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/training" onClick={closeNav}>
                  Training
                </Nav.Link>
                <Nav.Link as={Link} to="/jobs" onClick={closeNav}>
                  Jobs
                </Nav.Link>
                <Nav.Link as={Link} to="/companies" onClick={closeNav}>
                  Companies
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={user.name} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile" onClick={closeNav}>
                  <i className="fas fa-user me-2"></i>
                  Profile
                </NavDropdown.Item>

                {user.role === 'admin' && (
                  <NavDropdown.Item as={Link} to="/admin" onClick={closeNav}>
                    <i className="fas fa-cog me-2"></i>
                    Admin Panel
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={closeNav}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                  onClick={closeNav}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
