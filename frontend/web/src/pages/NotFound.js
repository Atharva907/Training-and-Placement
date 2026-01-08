
import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead mb-4">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Button as={Link} to="/" variant="primary">
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFound;
