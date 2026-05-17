import React from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Clipboard,
  IconButton,
} from '@chakra-ui/react';
import { Fingerprint, Copy, Check } from 'lucide-react';

/**
 * HashPreview — Displays the generated SHA-256 semantic hash.
 *
 * Props:
 *  - hash:          string (64-char hex)
 *  - algorithm:     string (e.g. "SHA-256")
 *  - processingTime: number (ms)
 */
const HashPreview = ({ hash, algorithm = 'SHA-256', processingTime }) => {
  if (!hash) return null;

  // Truncate for display: first 16 ... last 16
  const truncated = hash.length > 32
    ? `${hash.slice(0, 16)}...${hash.slice(-16)}`
    : hash;

  return (
    <Box
      p={5}
      bg="rgba(72,187,120,0.04)"
      borderWidth={1}
      borderColor="green.500/20"
      borderRadius="2xl"
    >
      <Flex align="center" gap={3} mb={4}>
        <Box
          boxSize={10}
          bg="green.950"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="green.800"
        >
          <Fingerprint size={18} color="#68d391" />
        </Box>
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm" color="white">
            Semantic Hash
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400">
            Content-based identity fingerprint
          </Text>
        </Box>
        <Badge colorPalette="green" variant="surface" fontSize="10px" borderRadius="full">
          {algorithm}
        </Badge>
      </Flex>

      {/* Hash display */}
      <Box
        p={4}
        bg="rgba(0,0,0,0.3)"
        borderRadius="xl"
        borderWidth={1}
        borderColor="whiteAlpha.80"
        position="relative"
      >
        <Clipboard.Root value={hash}>
          <Flex align="center" gap={3}>
            <Text
              fontFamily="mono"
              fontSize="xs"
              color="green.300"
              letterSpacing="wider"
              wordBreak="break-all"
              flex={1}
              title={hash}
            >
              {truncated}
            </Text>
            <Clipboard.Trigger asChild>
              <IconButton
                size="xs"
                variant="ghost"
                color="whiteAlpha.400"
                _hover={{ color: 'green.400', bg: 'whiteAlpha.100' }}
                aria-label="Copy hash"
              >
                <Clipboard.Indicator
                  copied={<Check size={14} />}
                >
                  <Copy size={14} />
                </Clipboard.Indicator>
              </IconButton>
            </Clipboard.Trigger>
          </Flex>
        </Clipboard.Root>
      </Box>

      {/* Metadata */}
      {processingTime && (
        <Text fontSize="10px" color="whiteAlpha.300" mt={3} textAlign="right">
          Generated in {processingTime}ms
        </Text>
      )}
    </Box>
  );
};

export default HashPreview;
