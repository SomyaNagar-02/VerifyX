import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

/**
 * ImageUpload — Drag & drop + click-to-pick image upload zone.
 *
 * Supports: .jpg, .jpeg, .png
 * Max size: 25 MB
 *
 * Props:
 *  - onFileSelect:   (file: File) => void
 *  - disabled:       boolean
 *  - selectedFile:   File | null (controlled)
 *  - onClear:        () => void
 */

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const ACCEPT_STRING = '.jpg,.jpeg,.png';

const validateImage = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG and PNG images are supported' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: `File is too large. Max size is 25MB (${(file.size / 1024 / 1024).toFixed(1)}MB selected)` };
  }
  return { valid: true, error: '' };
};

const ImageUpload = ({
  onFileSelect,
  disabled = false,
  selectedFile = null,
  onClear,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFile = useCallback((file) => {
    setFileError('');
    const { valid, error } = validateImage(file);
    if (!valid) {
      setFileError(error);
      return;
    }
    onFileSelect?.(file);
  }, [onFileSelect]);

  // ── Drag events ─────────────────────────────────────────────────────────────
  const onDragOver = (e) => { e.preventDefault(); if (!disabled) setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── Click-to-pick ───────────────────────────────────────────────────────────
  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const ext = selectedFile?.name?.split('.').pop()?.toUpperCase() || '';

  return (
    <Box>
      {/* Drop zone */}
      <Box
        as="button"
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        w="full"
        p={selectedFile ? 6 : 10}
        borderWidth={2}
        borderStyle="dashed"
        borderColor={
          fileError ? 'red.500'
            : isDragging ? 'purple.400'
            : selectedFile ? 'purple.500/40'
            : 'whiteAlpha.200'
        }
        borderRadius="2xl"
        bg={
          isDragging ? 'purple.950/30'
            : selectedFile ? 'purple.950/15'
            : 'whiteAlpha.50'
        }
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.5 : 1}
        transition="all 0.25s"
        _hover={!disabled ? { borderColor: 'purple.500', bg: 'whiteAlpha.80' } : {}}
        textAlign="center"
      >
        {selectedFile ? (
          // ── File selected state ─────────────────────────────────────────────
          <Flex align="center" gap={4}>
            <Box
              boxSize={12}
              bg="purple.950"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="purple.800"
              flexShrink={0}
            >
              <ImageIcon size={20} color="#b794f4" />
            </Box>
            <Box flex={1} textAlign="left">
              <Text color="white" fontWeight="bold" fontSize="sm" lineClamp={1}>
                {selectedFile.name}
              </Text>
              <Flex gap={2} mt={1} flexWrap="wrap">
                <Badge colorPalette="purple" variant="surface" fontSize="10px">
                  {ext}
                </Badge>
                <Badge variant="outline" borderColor="whiteAlpha.300" color="whiteAlpha.500" fontSize="10px">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Badge>
              </Flex>
            </Box>
            {onClear && (
              <Box
                as="span"
                onClick={(e) => { e.stopPropagation(); onClear(); setFileError(''); }}
                color="whiteAlpha.400"
                _hover={{ color: 'red.400' }}
                cursor="pointer"
                transition="color 0.2s"
                flexShrink={0}
              >
                <X size={18} />
              </Box>
            )}
          </Flex>
        ) : (
          // ── Empty state ─────────────────────────────────────────────────────
          <Stack gap={3} align="center">
            <Box
              boxSize={14}
              bg="whiteAlpha.80"
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="whiteAlpha.100"
            >
              <Upload size={24} color={isDragging ? '#b794f4' : 'rgba(255,255,255,0.3)'} />
            </Box>
            <Box>
              <Text color="whiteAlpha.700" fontWeight="medium" fontSize="sm">
                {isDragging ? 'Drop your image here' : 'Drag & drop an image'}
              </Text>
              <Text color="whiteAlpha.400" fontSize="xs" mt={1}>
                or click to browse — JPG, PNG (max 25MB)
              </Text>
            </Box>
          </Stack>
        )}
      </Box>

      {/* Error message */}
      {fileError && (
        <Text color="red.400" fontSize="xs" mt={2}>
          {fileError}
        </Text>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default ImageUpload;
