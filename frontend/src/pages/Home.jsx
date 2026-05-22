import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Stack, 
  Text, 
  Flex, 
  SimpleGrid, 
  Icon,
  Link as ChakraLink
} from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, Fingerprint, Search, Globe } from "lucide-react";
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Box bg="black" minH="100vh" color="white" overflowX="hidden">
      {/* Navigation */}
      <Box 
        borderBottomWidth={1} 
        borderColor="whiteAlpha.100" 
        py={4} 
        position="sticky" 
        top={0} 
        zIndex={10} 
        backdropFilter="blur(10px)"
        bg="blackAlpha.800"
      >
        <Container maxW="container.xl">
          <Flex align="center">
            <Flex align="center" gap={2}>
              <Box boxSize={8} bg="green.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <ShieldCheck size={20} color="black" />
              </Box>
              <Heading size="md" fontWeight="bold" color="white" letterSpacing="tighter">
                DocuTrust
              </Heading>
            </Flex>
            
            <Flex gap={8} ml={12} display={{ base: 'none', md: 'flex' }}>
              <ChakraLink href="#features" fontSize="sm" fontWeight="medium" color="whiteAlpha.700" _hover={{ color: 'green.400' }}>Features</ChakraLink>
              <ChakraLink href="#how-it-works" fontSize="sm" fontWeight="medium" color="whiteAlpha.700" _hover={{ color: 'green.400' }}>Process</ChakraLink>
              <ChakraLink href="#" fontSize="sm" fontWeight="medium" color="whiteAlpha.700" _hover={{ color: 'green.400' }}>Security</ChakraLink>
            </Flex>

            <Flex gap={4} ml="auto" align="center">
              <Button as={Link} to="/manual-verify" variant="outline" borderColor="whiteAlpha.300" color="white" _hover={{ bg: 'whiteAlpha.100' }} borderRadius="full" px={6}>
                Verify Document
              </Button>
              {isAuthenticated ? (
                <Button as={Link} to="/dashboard" colorPalette="green" variant="solid" px={6} borderRadius="full">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="ghost" color="whiteAlpha.800" _hover={{ bg: 'whiteAlpha.100', color: 'white' }}>
                    Login
                  </Button>
                  <Button as={Link} to="/signup" colorPalette="green" variant="solid" px={6} borderRadius="full">
                    Get Started
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box position="relative" pt={20} pb={32}>
        {/* Background Glow */}
        <Box 
          position="absolute" 
          top="-10%" 
          left="50%" 
          transform="translateX(-50%)" 
          boxSize="600px" 
          bg="green.900" 
          filter="blur(150px)" 
          opacity={0.15} 
          zIndex={0}
          borderRadius="full"
        />
        
        <Container maxW="container.lg" position="relative" zIndex={1}>
          <Stack gap={10} align="center" textAlign="center">
            <Box 
              px={4} 
              py={1.5} 
              borderRadius="full" 
              borderWidth={1} 
              borderColor="green.500/30" 
              bg="green.950/20" 
              color="green.400" 
              fontSize="xs" 
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="widest"
              backdropFilter="blur(5px)"
            >
              The New Standard in Document Integrity
            </Box>
            
            <Heading size="4xl" fontWeight="black" lineHeight="1.1" letterSpacing="tight">
              Verify Authenticity <br />
              <Text as="span" bgGradient="to-r" gradientFrom="green.400" gradientTo="emerald.500" bgClip="text">
                Without Storing Files
              </Text>
            </Heading>
            
            <Text fontSize="xl" color="whiteAlpha.700" maxW="2xl" lineHeight="tall">
              DocuTrust uses zero-knowledge semantic hashing to verify document integrity. 
              We track the identity of your data, not the binary file, protecting your privacy.
            </Text>
            
            <Stack direction={{ base: 'column', sm: 'row' }} gap={6} mt={4}>
              <Button as={Link} to="/signup" size="xl" colorPalette="green" px={10} borderRadius="full" fontSize="md">
                Create Account
              </Button>
              <Button as={Link} to="/manual-verify" variant="outline" size="xl" borderColor="whiteAlpha.300" color="white" borderRadius="full" px={10} fontSize="md" _hover={{ bg: 'whiteAlpha.100' }}>
                Verify a Document
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Metrics / Social Proof */}
      <Container maxW="container.xl" mb={32}>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} p={8} bg="whiteAlpha.50" borderRadius="3xl" borderWidth={1} borderColor="whiteAlpha.100">
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="black" color="green.400">100%</Text>
            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Privacy First</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="black" color="green.400">SHA-256</Text>
            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Security Standard</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="black" color="green.400">0ms</Text>
            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Latency verification</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="black" color="green.400">24/7</Text>
            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold">Audit Logging</Text>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Features Grid */}
      <Box py={32} bg="whiteAlpha.50" id="features">
        <Container maxW="container.xl">
          <Stack gap={16}>
            <Box textAlign="center">
              <Heading size="2xl" mb={4}>Built for Modern Compliance</Heading>
              <Text color="whiteAlpha.600" maxW="xl" mx="auto">
                Advanced technology designed to ensure document reliability across all formats.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              <FeatureItem 
                icon={Fingerprint} 
                title="Semantic ID" 
                text="Normalization algorithms ensure that screenshots or compressed PDFs retain their verifiable identity."
              />
              <FeatureItem 
                icon={Search} 
                title="OCR Assisted" 
                text="Structured field comparison extracts key data points to verify document content with surgical precision."
              />
              <FeatureItem 
                icon={Globe} 
                title="Seal ID System" 
                text="Every document receives a unique Seal ID and QR code for instant global verification."
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="container.md" py={32}>
        <Stack 
          p={12} 
          bgGradient="to-br" 
          gradientFrom="green.900" 
          gradientTo="black" 
          borderRadius="3xl" 
          textAlign="center" 
          gap={8}
          borderWidth={1}
          borderColor="green.500/30"
          position="relative"
          overflow="hidden"
        >
          <Heading size="xl">Ready to secure your documents?</Heading>
          <Text color="whiteAlpha.700">
            Join the organizations using DocuTrust for privacy-first verification.
          </Text>
          <Box>
            <Button as={Link} to="/signup" size="lg" colorPalette="green" px={12} borderRadius="full">
              Get Started Now
            </Button>
          </Box>
        </Stack>
      </Container>

      {/* Footer */}
      <Box borderTopWidth={1} borderColor="whiteAlpha.100" py={12} color="whiteAlpha.400">
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={6}>
            <Flex align="center" gap={2}>
              <Box boxSize={6} bg="green.500" borderRadius="sm" display="flex" alignItems="center" justifyContent="center">
                <ShieldCheck size={16} color="black" />
              </Box>
              <Text fontWeight="bold" color="white">DocuTrust</Text>
            </Flex>
            <Flex gap={8}>
              <ChakraLink href="#" _hover={{ color: 'white' }}>Privacy Policy</ChakraLink>
              <ChakraLink href="#" _hover={{ color: 'white' }}>Terms of Service</ChakraLink>
              <ChakraLink href="#" _hover={{ color: 'white' }}>Documentation</ChakraLink>
            </Flex>
            <Text fontSize="xs">© 2026 DocuTrust. All rights reserved.</Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

const FeatureItem = ({ icon, title, text }) => {
  return (
    <Stack 
      p={10} 
      bg="black" 
      borderRadius="3xl" 
      borderWidth={1} 
      borderColor="whiteAlpha.100"
      _hover={{ borderColor: 'green.500/50', bg: 'whiteAlpha.50', transform: 'translateY(-8px)' }}
      transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      cursor="pointer"
    >
      <Box boxSize={14} bg="green.950" borderRadius="2xl" display="flex" alignItems="center" justifyContent="center" mb={6} borderOutline="1px solid" outlineColor="green.500/20">
        <Icon as={icon} boxSize={7} color="green.400" />
      </Box>
      <Heading size="lg" mb={3} fontWeight="bold">{title}</Heading>
      <Text color="whiteAlpha.600" fontSize="md" lineHeight="tall">{text}</Text>
    </Stack>
  );
};

export default Home;
