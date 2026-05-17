import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Stack,
  Clipboard,
  IconButton,
  Input,
  Button,
} from '@chakra-ui/react';
import {
  ScanText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CheckCircle,
  XCircle,
  Sparkles,
  KeyRound,
} from 'lucide-react';

/**
 * OCRPreview — Displays extracted OCR text and structured fields with manual edit capability.
 *
 * Props:
 *  - ocrText:       string — raw extracted text
 *  - fields:        { name, certificateId, issueDate, issuer, registrationNumber }
 *  - completeness:  { filled, total, percentage }
 *  - confidence:    number (0-100) — OCR confidence
 *  - wordCount:     number
 */

const FIELD_CONFIG = [
  { key: 'name',               label: 'Name',                icon: '👤' },
  { key: 'certificateId',      label: 'Certificate ID',      icon: '🏷️' },
  { key: 'issueDate',          label: 'Issue Date',          icon: '📅' },
  { key: 'issuer',             label: 'Issuer / Authority',  icon: '🏛️' },
  { key: 'registrationNumber', label: 'Registration Number', icon: '🔢' },
];

/**
 * Helper to normalize diverse OCR date extractions into YYYY-MM-DD required by HTML5 date inputs.
 */
const normalizeToInputDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '';

  const clean = dateStr.trim();
  
  // 1. Direct YYYY-MM-DD
  const matchIso = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (matchIso) {
    return `${matchIso[1]}-${matchIso[2]}-${matchIso[3]}`;
  }

  // 2. Parse standard Javascript Date
  const parsed = Date.parse(clean);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // 3. Try parsing custom formats (DD/MM/YYYY or MM/DD/YYYY)
  const parts = clean.split(/[\/\-.]/);
  if (parts.length === 3) {
    // YYYY first
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    // DD or MM first - let's guess YYYY is the last part
    if (parts[2].length === 4) {
      const year = parts[2];
      // default to DD/MM/YYYY parsing
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  return '';
};

const OCRPreview = ({
  ocrText = '',
  fields = {},
  completeness = {},
  confidence = 0,
  wordCount = 0,
}) => {
  const [showRawText, setShowRawText] = useState(false);
  const [editableFields, setEditableFields] = useState(fields);
  const [isSealed, setIsSealed] = useState(false);
  const [sealId, setSealId] = useState('');

  // Sync state if props change
  useEffect(() => {
    // Keep date normalized if preset
    const initialFields = { ...fields };
    if (initialFields.issueDate) {
      initialFields.issueDate = normalizeToInputDate(initialFields.issueDate);
    }
    setEditableFields(initialFields);
    setIsSealed(false);
  }, [fields]);

  const handleFieldChange = (key, value) => {
    setEditableFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateSeal = () => {
    // Generate a beautiful, high-entropy simulated image Seal ID
    const randomHex1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedId = `SEAL-${randomHex1}-${randomHex2}`;
    
    setSealId(generatedId);
    setIsSealed(true);
  };

  const filled = FIELD_CONFIG.filter(({ key }) => editableFields[key]?.trim()).length;
  const total = FIELD_CONFIG.length;
  const percentage = Math.round((filled / total) * 100);

  if (isSealed) {
    return (
      <Box
        p={6}
        bg="rgba(183,148,244,0.04)"
        borderWidth={1}
        borderColor="purple.500/30"
        borderRadius="2xl"
        textAlign="center"
        transition="all 0.3s ease"
      >
        <Box
          boxSize={14}
          bg="purple.950"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="purple.800"
          mx="auto"
          mb={4}
        >
          <Sparkles size={24} color="#b794f4" />
        </Box>
        <Text fontWeight="black" fontSize="lg" color="white" mb={1}>
          Image Sealed Successfully!
        </Text>
        <Text fontSize="xs" color="whiteAlpha.500" mb={5}>
          Visual blueprint (pHash) and verified metadata stored securely. Original image is discarded.
        </Text>

        <Box
          p={4}
          bg="rgba(0,0,0,0.3)"
          borderRadius="xl"
          borderWidth={1}
          borderColor="purple.500/20"
          mb={5}
        >
          <Text fontSize="xs" color="whiteAlpha.400" textTransform="uppercase" fontWeight="black" letterSpacing="wider" mb={1}>
            Your Secure Seal ID
          </Text>
          <Text
            fontFamily="mono"
            fontSize="lg"
            fontWeight="bold"
            color="purple.300"
            letterSpacing="widest"
          >
            {sealId}
          </Text>
        </Box>

        <Button
          onClick={() => setIsSealed(false)}
          size="sm"
          variant="outline"
          borderColor="whiteAlpha.200"
          color="whiteAlpha.600"
          _hover={{ borderColor: 'purple.500', color: 'purple.400' }}
          borderRadius="full"
          px={6}
        >
          Edit Fields / Seal Again
        </Button>
      </Box>
    );
  }

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
          bg="blue.950"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="blue.800"
        >
          <ScanText size={18} color="#63b3ed" />
        </Box>
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm" color="white">
            Verify &amp; Seal Image
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400">
            Verify extracted content and manually edit/fill fields as needed.
          </Text>
        </Box>
        <Flex gap={2} flexWrap="wrap">
          {confidence > 0 && (
            <Badge
              colorPalette={confidence >= 80 ? 'green' : confidence >= 50 ? 'yellow' : 'red'}
              variant="surface"
              fontSize="10px"
              borderRadius="full"
            >
              {confidence}% conf.
            </Badge>
          )}
          {wordCount > 0 && (
            <Badge
              variant="outline"
              borderColor="whiteAlpha.300"
              color="whiteAlpha.500"
              fontSize="10px"
              borderRadius="full"
            >
              {wordCount} words
            </Badge>
          )}
          <Badge
            colorPalette={percentage >= 60 ? 'green' : percentage > 0 ? 'yellow' : 'red'}
            variant="surface"
            fontSize="10px"
            borderRadius="full"
          >
            {filled}/{total} fields
          </Badge>
        </Flex>
      </Flex>

      {/* Structured fields */}
      <Stack gap={4} mb={5}>
        {FIELD_CONFIG.map(({ key, label, icon }) => {
          const value = editableFields[key] || '';
          const hasValue = value.trim() !== '';

          return (
            <Box key={key}>
              <Flex align="center" justify="space-between" mb={1.5} px={1}>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm">{icon}</Text>
                  <Text fontSize="xs" fontWeight="semibold" color="whiteAlpha.600">
                    {label}
                  </Text>
                </Flex>
                {hasValue ? (
                  <Badge colorPalette="purple" variant="subtle" fontSize="8px" borderRadius="full">Detected</Badge>
                ) : (
                  <Badge colorPalette="orange" variant="outline" fontSize="8px" borderRadius="full">Manual entry required</Badge>
                )}
              </Flex>
              <Input
                type={key === 'issueDate' ? 'date' : 'text'}
                value={value}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder={key === 'issueDate' ? 'Select date...' : `Enter ${label}...`}
                size="sm"
                bg="rgba(0,0,0,0.25)"
                borderWidth={1}
                borderColor={hasValue ? 'purple.500/20' : 'whiteAlpha.100'}
                color="white"
                css={{
                  "&::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                    cursor: "pointer",
                    opacity: 0.7,
                    _hover: { opacity: 1 }
                  }
                }}
                _placeholder={{ color: 'whiteAlpha.300' }}
                _hover={{ borderColor: 'whiteAlpha.300' }}
                _focus={{
                  borderColor: 'purple.500',
                  bg: 'black',
                  boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)'
                }}
                borderRadius="xl"
                px={3}
                py={1.5}
                fontSize="sm"
                h="36px"
              />
            </Box>
          );
        })}
      </Stack>

      {/* Action button */}
      <Button
        onClick={handleGenerateSeal}
        colorPalette="purple"
        size="lg"
        width="full"
        borderRadius="full"
        fontWeight="bold"
        boxShadow="0 0 20px rgba(183,148,244,0.15)"
        _hover={{ boxShadow: '0 0 30px rgba(183,148,244,0.3)', transform: 'translateY(-1px)' }}
        transition="all 0.2s"
        mb={4}
      >
        <KeyRound size={16} />
        Confirm &amp; Seal Image
      </Button>

      {/* Raw OCR text — collapsible */}
      {ocrText && (
        <Box
          p={4}
          bg="rgba(0,0,0,0.15)"
          borderRadius="xl"
          borderWidth={1}
          borderColor="whiteAlpha.80"
        >
          <Box
            as="button"
            type="button"
            onClick={() => setShowRawText(prev => !prev)}
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontWeight="bold" fontSize="xs" color="whiteAlpha.600">
              Show Raw Extracted OCR Text
            </Text>
            {showRawText
              ? <ChevronUp size={14} color="rgba(255,255,255,0.3)" />
              : <ChevronDown size={14} color="rgba(255,255,255,0.3)" />
            }
          </Box>
          {showRawText && (
            <Box mt={3}>
              <Box
                p={3}
                bg="rgba(0,0,0,0.3)"
                borderRadius="lg"
                maxH="250px"
                overflowY="auto"
                position="relative"
              >
                <Clipboard.Root value={ocrText}>
                  <Clipboard.Trigger asChild>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      color="whiteAlpha.400"
                      _hover={{ color: 'blue.400', bg: 'whiteAlpha.100' }}
                      aria-label="Copy OCR text"
                      position="absolute"
                      top={2}
                      right={2}
                    >
                      <Clipboard.Indicator copied={<Check size={12} />}>
                        <Copy size={12} />
                      </Clipboard.Indicator>
                    </IconButton>
                  </Clipboard.Trigger>
                </Clipboard.Root>
                <Text
                  fontSize="xs"
                  color="whiteAlpha.500"
                  fontFamily="mono"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pr={8}
                >
                  {ocrText}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OCRPreview;
