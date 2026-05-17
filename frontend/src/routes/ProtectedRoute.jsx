import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Guards child routes behind authentication.
 *
 * Behavior:
 *  - While AuthContext is still rehydrating → show a centered spinner (prevents flash-redirects)
 *  - If not authenticated → redirect to /login
 *  - If authenticated → render <Outlet /> (child route)
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Wait for context to finish reading localStorage before making a decision
  if (!isInitialized) {
    return (
      <Box minH="100vh" bg="black" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <Spinner
            size="xl"
            color="green.400"
            borderWidth="3px"
          />
        </Center>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
