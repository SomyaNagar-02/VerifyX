import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { Upload, FileText, Image, X, FileCheck } from 'lucide-react';
import { validateFile, ACCEPTED_FILE_TYPES } from '../utils/file/detectFileType';

/**
 * FileUpload — Drag & drop + click-to-pick file upload zone.
 *
 * Props:
 *  - onFileSelect:   (file: File) => void
 *  - disabled:       boolean
 *  - selectedFile:   File | null  (controlled)
 *  - onClear:        () => void
 */
const FileUpload = ({
  onFileSelect,
  disabled = false,
  selectedFile = null,
  onClear,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError]   = useState('');

  const handleFile = useCallback((file) => {
    setFileError('');
    const { valid, error } = validateFile(file);
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
    e.target.value = ''; // reset so same file can be re-selected
  };

  const isPdf = selectedFile?.type === 'application/pdf';
  const FileIcon = selectedFile ? (isPdf ? FileText : Image) : Upload;

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
            : isDragging ? 'green.400'
            : selectedFile ? 'green.500/40'
            : 'whiteAlpha.200'
        }
        borderRadius="2xl"
        bg={
          isDragging ? 'green.950/30'
            : selectedFile ? 'green.950/15'
            : 'whiteAlpha.50'
        }
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.5 : 1}
        transition="all 0.25s"
        _hover={!disabled ? { borderColor: 'green.500', bg: 'whiteAlpha.80' } : {}}
        textAlign="center"
      >
        {selectedFile ? (
          // ── File selected state ─────────────────────────────────────────────
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
              flexShrink={0}
            >
              <FileIcon size={20} color="#68d391" />
            </Box>
            <Box flex={1} textAlign="left">
              <Text color="white" fontWeight="bold" fontSize="sm" lineClamp={1}>
                {selectedFile.name}
              </Text>
              <Flex gap={2} mt={1} flexWrap="wrap">
                <Badge colorPalette="green" variant="surface" fontSize="10px">
                  {isPdf ? 'PDF' : selectedFile.type.split('/')[1]?.toUpperCase()}
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
              <Upload size={24} color={isDragging ? '#68d391' : 'rgba(255,255,255,0.3)'} />
            </Box>
            <Box>
              <Text color="whiteAlpha.700" fontWeight="medium" fontSize="sm">
                {isDragging ? 'Drop your file here' : 'Drag & drop a document'}
              </Text>
              <Text color="whiteAlpha.400" fontSize="xs" mt={1}>
                or click to browse — PDF, JPG, PNG (max 25MB)
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
        accept={ACCEPTED_FILE_TYPES}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default FileUpload;
