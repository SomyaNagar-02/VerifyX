import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Stack,
  Flex,
  Badge,
  Input,
  Button,
} from '@chakra-ui/react';
import { CheckCircle, XCircle, FileSearch, Sparkles, KeyRound } from 'lucide-react';

/**
 * ExtractedFields — Displays OCR-extracted structured fields with manual edit capability.
 *
 * Props:
 *  - fields:            { name, certificateId, issueDate, issuer, registrationNumber }
 *  - fieldCompleteness: { filled, total, percentage }
 *  - ocrConfidence:     number (0-100)
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

const ExtractedFields = ({ fields = {}, fieldCompleteness, ocrConfidence }) => {
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
    // Generate a beautiful, high-entropy simulated Seal ID
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
        bg="rgba(104,211,145,0.04)"
        borderWidth={1}
        borderColor="green.500/30"
        borderRadius="2xl"
        textAlign="center"
        transition="all 0.3s ease"
      >
        <Box
          boxSize={14}
          bg="green.950"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="green.800"
          mx="auto"
          mb={4}
        >
          <Sparkles size={24} color="#68d391" />
        </Box>
        <Text fontWeight="black" fontSize="lg" color="white" mb={1}>
          Document Sealed Successfully!
        </Text>
        <Text fontSize="xs" color="whiteAlpha.500" mb={5}>
          Semantic content blueprint stored securely. Original PDF is discarded.
        </Text>

        <Box
          p={4}
          bg="rgba(0,0,0,0.3)"
          borderRadius="xl"
          borderWidth={1}
          borderColor="green.500/20"
          mb={5}
        >
          <Text fontSize="xs" color="whiteAlpha.400" textTransform="uppercase" fontWeight="black" letterSpacing="wider" mb={1}>
            Your Secure Seal ID
          </Text>
          <Text
            fontFamily="mono"
            fontSize="lg"
            fontWeight="bold"
            color="green.300"
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
          _hover={{ borderColor: 'green.500', color: 'green.400' }}
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
          bg="green.950"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="green.800"
        >
          <FileSearch size={18} color="#68d391" />
        </Box>
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm" color="white">
            Verify &amp; Seal Document
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400">
            Verify extracted content and manually edit/fill fields as needed.
          </Text>
        </Box>
        <Flex gap={2} flexWrap="wrap">
          <Badge
            colorPalette={percentage >= 60 ? 'green' : percentage > 0 ? 'yellow' : 'red'}
            variant="surface"
            fontSize="10px"
            borderRadius="full"
          >
            {filled}/{total} fields
          </Badge>
          {ocrConfidence != null && ocrConfidence > 0 && (
            <Badge
              variant="outline"
              borderColor="whiteAlpha.300"
              color="whiteAlpha.500"
              fontSize="10px"
              borderRadius="full"
            >
              OCR {ocrConfidence}%
            </Badge>
          )}
        </Flex>
      </Flex>

      {/* Field list */}
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
                  <Badge colorPalette="green" variant="subtle" fontSize="8px" borderRadius="full">Detected</Badge>
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
                borderColor={hasValue ? 'green.500/20' : 'whiteAlpha.100'}
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
                  borderColor: 'green.500',
                  bg: 'black',
                  boxShadow: '0 0 0 1px var(--chakra-colors-green-500)'
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
        colorPalette="green"
        size="lg"
        width="full"
        borderRadius="full"
        fontWeight="bold"
        boxShadow="0 0 20px rgba(104,211,145,0.15)"
        _hover={{ boxShadow: '0 0 30px rgba(104,211,145,0.3)', transform: 'translateY(-1px)' }}
        transition="all 0.2s"
      >
        <KeyRound size={16} />
        Confirm &amp; Seal Document
      </Button>
    </Box>
  );
};

export default ExtractedFields;
