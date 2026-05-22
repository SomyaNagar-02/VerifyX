import React, { useState } from 'react';
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
  Badge,
} from "@chakra-ui/react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toaster } from '../components/ui/toaster';
import {
  ShieldCheck,
  LogOut,
  FileSearch,
  Upload,
  Activity,
  Lock,
  User,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: IconComp, color }) => (
  <Box
    p={6}
    bg="rgba(255,255,255,0.03)"
    borderWidth={1}
    borderColor="whiteAlpha.100"
    borderRadius="2xl"
    _hover={{ borderColor: 'green.500', bg: 'rgba(255,255,255,0.05)', transform: 'translateY(-2px)' }}
    transition="all 0.25s"
    cursor="default"
  >
    <Flex align="center" gap={4}>
      <Box
        boxSize={12}
        bg="green.950"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderWidth={1}
        borderColor="green.800"
      >
        <Icon as={IconComp} boxSize={5} color="green.400" />
      </Box>
      <Box>
        <Text fontSize="2xl" fontWeight="black" color="white">{value}</Text>
        <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" fontWeight="bold" letterSpacing="wider">{label}</Text>
      </Box>
    </Flex>
  </Box>
);

// ─── Action Card ───────────────────────────────────────────────────────────────
const ActionCard = ({ icon: IconComp, title, description, badge, onClick }) => (
  <Box
    p={8}
    bg="rgba(255,255,255,0.03)"
    borderWidth={1}
    borderColor="whiteAlpha.100"
    borderRadius="2xl"
    _hover={{ borderColor: 'green.500/50', bg: 'rgba(255,255,255,0.05)', transform: 'translateY(-4px)' }}
    transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    cursor="pointer"
    onClick={onClick}
    position="relative"
  >
    {badge && (
      <Badge
        position="absolute"
        top={4}
        right={4}
        colorPalette="green"
        variant="surface"
        borderRadius="full"
        fontSize="9px"
      >
        {badge}
      </Badge>
    )}
    <Stack gap={4}>
      <Box
        boxSize={14}
        bg="green.950"
        borderRadius="2xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderWidth={1}
        borderColor="green.800"
      >
        <Icon as={IconComp} boxSize={6} color="green.400" />
      </Box>
      <Box>
        <Heading size="md" mb={2} color="white">{title}</Heading>
        <Text fontSize="sm" color="whiteAlpha.500" lineHeight="tall">{description}</Text>
      </Box>
    </Stack>
  </Box>
);

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toaster.create({
      title: 'Logged out',
      description: 'You have been securely signed out.',
      type: 'info',
      duration: 3000,
      closable: true,
    });
    navigate('/login');
  };

  const displayName = user?.name || user?.email || 'Issuer';

  return (
    <Box minH="100vh" bg="black" color="white" overflowX="hidden">

      {/* Ambient background */}
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

      {/* Navbar */}
      <Box
        borderBottomWidth={1}
        borderColor="whiteAlpha.100"
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
        backdropFilter="blur(20px)"
        bg="rgba(0,0,0,0.7)"
      >
        <Container maxW="container.xl">
          <Flex align="center">
            <Flex align="center" gap={2}>
              <Box
                boxSize={8}
                bg="green.500"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <ShieldCheck size={18} color="black" />
              </Box>
              <Heading size="md" fontWeight="bold" letterSpacing="tighter">
                DocuTrust
              </Heading>
            </Flex>

            <Flex gap={3} ml="auto" align="center">
              <Button
                as={Link}
                to="/profile"
                variant="ghost"
                height="auto"
                py={1}
                px={3}
                borderRadius="full"
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                <Flex align="center" gap={2}>
                  <Box
                    boxSize={7}
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <User size={14} color="white" />
                  </Box>
                  <Text fontSize="sm" color="whiteAlpha.800" display={{ base: 'none', sm: 'block' }}>
                    {displayName}
                  </Text>
                </Flex>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                color="whiteAlpha.600"
                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                onClick={handleLogout}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <LogOut size={14} />
                Logout
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={12} position="relative" zIndex={1}>
        <Stack gap={12}>
          {/* Welcome Header */}
          <Box>
            <Text color="green.400" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider" mb={2}>
              Testing Dashboard
            </Text>
            <Heading size="3xl" fontWeight="black" letterSpacing="tighter">
              Welcome back, {displayName.split(' ')[0]} 👋
            </Heading>
            <Text color="whiteAlpha.500" mt={2} fontSize="md">
              Your document verification hub — zero files stored, proofs only.
            </Text>
          </Box>

          {/* Stats Row */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
            <StatCard label="Documents Sealed" value="—" icon={Lock} />
            <StatCard label="Verifications Run" value="—" icon={Activity} />
            <StatCard label="Audit Logs" value="—" icon={FileSearch} />
            <StatCard label="Account Role" value="Issuer" icon={ShieldCheck} />
          </SimpleGrid>

          {/* Actions */}
          <Box>
            <Heading size="lg" mb={6} fontWeight="bold">
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <ActionCard
                icon={Upload}
                title="Seal a Document"
                description="Upload a document to generate its cryptographic Seal ID and store the hash proof."
                badge="Ready"
                onClick={() => navigate('/issue-document')}
              />
              <ActionCard
                icon={Activity}
                title="Audit Logs"
                description="Review a full timestamped log of all verification events tied to your account."
                badge="Coming Soon"
              />
            </SimpleGrid>
          </Box>

          {/* Info Banner */}
          <Box
            p={6}
            bg="rgba(72,187,120,0.05)"
            borderWidth={1}
            borderColor="green.500"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            gap={4}
          >
            <Box
              boxSize={10}
              bg="green.950"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Lock size={18} color="#68d391" />
            </Box>
            <Box>
              <Text fontWeight="bold" color="white" mb={0.5}>Privacy-first architecture active</Text>
              <Text fontSize="sm" color="whiteAlpha.500">
                Your documents are never stored. Only SHA-256 hashes, OCR field signatures, and audit metadata are retained.
              </Text>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
