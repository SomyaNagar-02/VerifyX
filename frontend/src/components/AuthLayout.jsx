import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ShieldCheck } from "lucide-react";

/**
 * AuthLayout — Shared wrapper for Login and Signup pages.
 *
 * Props:
 *  - subtitle: string   — displayed below "DocuTrust" heading
 *  - children: ReactNode — the form content
 */
const AuthLayout = ({ subtitle, children }) => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="black"
      color="white"
      position="relative"
      overflow="hidden"
      px={4}
      py={12}
    >
      {/* Ambient Background Glow */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="700px"
        h="700px"
        bg="green.900"
        filter="blur(180px)"
        opacity={0.12}
        zIndex={0}
        borderRadius="full"
        pointerEvents="none"
      />

      {/* Secondary glow — top-right accent */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="400px"
        h="400px"
        bg="green.700"
        filter="blur(140px)"
        opacity={0.06}
        zIndex={0}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="md" position="relative" zIndex={1} w="full">
        {/* Glassmorphic Card */}
        <Box
          p={{ base: 8, md: 10 }}
          borderWidth={1}
          borderColor="whiteAlpha.100"
          borderRadius="3xl"
          bg="rgba(0,0,0,0.6)"
          backdropFilter="blur(20px)"
          boxShadow="0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
          position="relative"
          overflow="hidden"
        >
          {/* Card inner glow shimmer */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="1px"
            bgGradient="to-r"
            gradientFrom="transparent"
            gradientVia="whiteAlpha.300"
            gradientTo="transparent"
          />

          <Stack gap={8}>
            {/* Brand Header */}
            <Box textAlign="center">
              <Flex justify="center" mb={5}>
                <Box
                  boxSize={14}
                  bg="green.500"
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 0 30px rgba(72,187,120,0.4)"
                >
                  <ShieldCheck size={30} color="black" />
                </Box>
              </Flex>
              <Heading
                size="2xl"
                fontWeight="black"
                color="white"
                letterSpacing="tighter"
              >
                DocuTrust
              </Heading>
              {subtitle && (
                <Text color="whiteAlpha.500" mt={2} fontSize="sm">
                  {subtitle}
                </Text>
              )}
            </Box>

            {/* Page-specific content */}
            {children}
          </Stack>
        </Box>

        {/* Footer note */}
        <Text
          textAlign="center"
          mt={6}
          fontSize="xs"
          color="whiteAlpha.300"
        >
          Protected by end-to-end semantic hashing
        </Text>
      </Container>
    </Box>
  );
};

export default AuthLayout;
