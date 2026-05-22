import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Wait for context to finish reading localStorage before making a decision
  if (!isInitialized) {
    return (
      <Box minH="100vh" bg="black" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <Spinner size="xl" color="green.400" borderWidth="3px" />
        </Center>
      </Box>
    );
  }

  // If the user is already logged in, redirect them to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, let them access the public route (like Login or Signup)
  return <Outlet />;
};

export default PublicRoute;
