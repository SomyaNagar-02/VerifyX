import React from 'react';
import { Box, Container, Heading, Text, Stack, Flex, Button, Badge } from "@chakra-ui/react";
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Mail, Building, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Box minH="100vh" bg="black" color="white" pt={8} pb={12} overflowX="hidden">
      <Box
        position="fixed"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        w="800px"
        h="400px"
        bg="green.900"
        filter="blur(200px)"
        opacity={0.06}
        zIndex={0}
        pointerEvents="none"
      />

      <Container maxW="container.md" position="relative" zIndex={1}>
        <Button variant="ghost" color="whiteAlpha.600" mb={8} _hover={{ color: 'white', bg: 'whiteAlpha.100' }} onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Back to Dashboard
        </Button>
        
        <Box bg="rgba(255,255,255,0.03)" p={10} borderRadius="2xl" borderWidth={1} borderColor="whiteAlpha.100">
          <Flex align="center" gap={6} mb={10}>
            <Box boxSize={20} bg="green.950" borderRadius="2xl" display="flex" alignItems="center" justifyContent="center" border="1px solid" borderColor="green.800">
              <User size={40} color="#4ade80" />
            </Box>
            <Box>
              <Heading size="2xl" color="white">{user.name}</Heading>
              <Badge bg="green.950" color="green.400" border="1px solid" borderColor="green.800" mt={3} px={4} py={1.5} borderRadius="full">
                {user.role || 'Issuer'} Account
              </Badge>
            </Box>
          </Flex>

          <Stack gap={4}>
            <Box bg="rgba(0,0,0,0.3)" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
              <Flex align="center" gap={4}>
                <Box p={3} bg="whiteAlpha.100" borderRadius="lg">
                  <Mail size={20} color="#a0aec0" />
                </Box>
                <Box>
                  <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Email Address</Text>
                  <Text fontSize="md" color="white">{user.email}</Text>
                </Box>
              </Flex>
            </Box>
            
            <Box bg="rgba(0,0,0,0.3)" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
              <Flex align="center" gap={4}>
                <Box p={3} bg="whiteAlpha.100" borderRadius="lg">
                  <Building size={20} color="#a0aec0" />
                </Box>
                <Box>
                  <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Organization</Text>
                  <Text fontSize="md" color="white">{user.organization || 'Not provided'}</Text>
                </Box>
              </Flex>
            </Box>
            
            <Box bg="rgba(0,0,0,0.3)" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
              <Flex align="center" gap={4}>
                <Box p={3} bg="whiteAlpha.100" borderRadius="lg">
                  <ShieldCheck size={20} color="#a0aec0" />
                </Box>
                <Box>
                  <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Account ID</Text>
                  <Text fontSize="sm" color="whiteAlpha.700" fontFamily="monospace">{user.id || user._id}</Text>
                </Box>
              </Flex>
            </Box>
          </Stack>

          <Flex mt={10} pt={8} borderTop="1px solid" borderColor="whiteAlpha.100" justify="flex-end">
            <Button colorPalette="red" variant="outline" onClick={() => { logout(); navigate('/login'); }}>
              Sign Out
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
