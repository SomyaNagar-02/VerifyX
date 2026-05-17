import React from 'react';
import {
  Box,
  Stack,
  Text,
  Progress,
  Badge,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { STAGES } from '../utils/file/documentProcessor';

/**
 * ProcessingStatus — Shows the current processing pipeline state.
 *
 * Props:
 *  - stage:    string (from STAGES)
 *  - percent:  number (0-100)
 *  - loading:  boolean
 *  - error:    string | null
 */
const ProcessingStatus = ({ stage = '', percent = 0, loading = false, error = null }) => {
  if (!loading && !stage && !error) return null;

  const isComplete = stage === STAGES.COMPLETE;
  const isError    = !!error;

  return (
    <Box
      p={5}
      bg={isError ? 'rgba(239,68,68,0.06)' : isComplete ? 'rgba(72,187,120,0.06)' : 'whiteAlpha.50'}
      borderWidth={1}
      borderColor={isError ? 'red.500/30' : isComplete ? 'green.500/30' : 'whiteAlpha.100'}
      borderRadius="2xl"
    >
      <Stack gap={4}>
        {/* Status header */}
        <Flex align="center" gap={3}>
          {isError ? (
            <AlertCircle size={18} color="#fc8181" />
          ) : isComplete ? (
            <CheckCircle size={18} color="#68d391" />
          ) : (
            <Spinner size="sm" color="green.400" borderWidth="2px" />
          )}
          <Box flex={1}>
            <Text
              fontWeight="bold"
              fontSize="sm"
              color={isError ? 'red.400' : isComplete ? 'green.400' : 'white'}
            >
              {isError ? 'Processing Failed' : isComplete ? 'Processing Complete' : 'Processing Document'}
            </Text>
            <Text fontSize="xs" color="whiteAlpha.500" mt={0.5}>
              {isError ? error : stage}
            </Text>
          </Box>
          {!isError && (
            <Badge
              colorPalette={isComplete ? 'green' : 'yellow'}
              variant="surface"
              fontSize="10px"
              borderRadius="full"
            >
              {percent}%
            </Badge>
          )}
        </Flex>

        {/* Progress bar */}
        {loading && !isError && (
          <Progress.Root value={percent} size="xs" colorPalette="green">
            <Progress.Track bg="whiteAlpha.100" borderRadius="full">
              <Progress.Range
                borderRadius="full"
                transition="width 0.4s ease"
              />
            </Progress.Track>
          </Progress.Root>
        )}

        {/* Pipeline stage badges */}
        {loading && !isError && (
          <Flex gap={2} flexWrap="wrap">
            {[
              { label: 'Detect',    done: percent > 5 },
              { label: 'Extract',   done: percent > 20 },
              { label: 'Normalize', done: percent > 35 },
              { label: 'SHA-256',   done: percent > 45 },
              { label: 'OCR',       done: percent > 80 },
              { label: 'Fields',    done: percent > 92 },
            ].map(({ label, done }) => (
              <Badge
                key={label}
                variant={done ? 'solid' : 'outline'}
                colorPalette={done ? 'green' : 'gray'}
                borderRadius="full"
                fontSize="9px"
                px={2}
                py={0.5}
              >
                {label}
              </Badge>
            ))}
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export default ProcessingStatus;
