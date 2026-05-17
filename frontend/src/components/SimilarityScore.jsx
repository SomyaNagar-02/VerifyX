import React from 'react';
import {
  Box,
  Text,
  Stack,
  Flex,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { Eye, BarChart3, FileSearch, Shield } from 'lucide-react';

/**
 * SimilarityScore — Displays visual, OCR, and field similarity scores.
 *
 * Props:
 *  - visualSimilarity:   number (0-100)
 *  - ocrSimilarity:      number (0-100)
 *  - fieldSimilarity:    number (0-100)
 *  - overallConfidence:  number (0-100)
 *
 * For Phase 4 single-image mode (no comparison), this component can also
 * display placeholder confidence metrics from OCR and field extraction.
 */

const getScoreColor = (score) => {
  if (score >= 90) return 'green';
  if (score >= 70) return 'yellow';
  return 'red';
};

const getScoreLabel = (score) => {
  if (score >= 90) return 'High';
  if (score >= 70) return 'Moderate';
  return 'Low';
};

const ScoreBar = ({ icon: Icon, label, value, colorPalette }) => (
  <Box
    p={4}
    bg="whiteAlpha.50"
    borderRadius="xl"
    borderWidth={1}
    borderColor="whiteAlpha.80"
  >
    <Flex align="center" gap={2} mb={3}>
      <Icon size={14} color={`var(--chakra-colors-${colorPalette}-400)`} />
      <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium" flex={1}>
        {label}
      </Text>
      <Badge
        colorPalette={colorPalette}
        variant="surface"
        fontSize="10px"
        borderRadius="full"
      >
        {value}%
      </Badge>
    </Flex>
    <Progress.Root
      value={value}
      size="xs"
      colorPalette={colorPalette}
    >
      <Progress.Track bg="whiteAlpha.100" borderRadius="full">
        <Progress.Range borderRadius="full" transition="width 0.6s ease" />
      </Progress.Track>
    </Progress.Root>
  </Box>
);

const SimilarityScore = ({
  visualSimilarity = 0,
  ocrSimilarity = 0,
  fieldSimilarity = 0,
  overallConfidence = 0,
}) => {
  const overallColor = getScoreColor(overallConfidence);
  const overallLabel = getScoreLabel(overallConfidence);

  return (
    <Box
      p={5}
      bg="whiteAlpha.50"
      borderWidth={1}
      borderColor="whiteAlpha.100"
      borderRadius="2xl"
    >
      {/* Header */}
      <Flex align="center" gap={3} mb={5}>
        <Box
          boxSize={10}
          bg={`${overallColor}.950`}
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor={`${overallColor}.800`}
        >
          <Shield size={18} color={`var(--chakra-colors-${overallColor}-400)`} />
        </Box>
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm" color="white">
            Similarity Analysis
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400">
            Multi-dimensional confidence assessment
          </Text>
        </Box>
        <Flex align="center" gap={2}>
          <Badge
            colorPalette={overallColor}
            variant="surface"
            fontSize="sm"
            borderRadius="full"
            px={3}
            py={1}
            fontWeight="black"
          >
            {overallConfidence}%
          </Badge>
          <Badge
            variant="outline"
            borderColor={`${overallColor}.500`}
            color={`${overallColor}.400`}
            fontSize="10px"
            borderRadius="full"
          >
            {overallLabel}
          </Badge>
        </Flex>
      </Flex>

      {/* Score bars */}
      <Stack gap={3}>
        <ScoreBar
          icon={Eye}
          label="Visual Similarity (pHash)"
          value={visualSimilarity}
          colorPalette={getScoreColor(visualSimilarity)}
        />
        <ScoreBar
          icon={BarChart3}
          label="OCR Text Similarity"
          value={ocrSimilarity}
          colorPalette={getScoreColor(ocrSimilarity)}
        />
        <ScoreBar
          icon={FileSearch}
          label="Field Match"
          value={fieldSimilarity}
          colorPalette={getScoreColor(fieldSimilarity)}
        />
      </Stack>

      {/* Overall progress */}
      <Box
        mt={4}
        p={4}
        bg={`rgba(${overallColor === 'green' ? '72,187,120' : overallColor === 'yellow' ? '236,201,75' : '239,68,68'},0.06)`}
        borderRadius="xl"
        borderWidth={1}
        borderColor={`${overallColor}.500/20`}
      >
        <Flex align="center" justify="space-between" mb={2}>
          <Text fontSize="xs" color="whiteAlpha.600" fontWeight="bold">
            Overall Confidence
          </Text>
          <Text
            fontSize="lg"
            fontWeight="black"
            color={`${overallColor}.400`}
          >
            {overallConfidence}%
          </Text>
        </Flex>
        <Progress.Root
          value={overallConfidence}
          size="sm"
          colorPalette={overallColor}
        >
          <Progress.Track bg="whiteAlpha.100" borderRadius="full">
            <Progress.Range borderRadius="full" transition="width 0.8s ease" />
          </Progress.Track>
        </Progress.Root>
      </Box>
    </Box>
  );
};

export default SimilarityScore;
