import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Flex,
  Badge,
  Separator,
  Collapsible,
} from '@chakra-ui/react';
import {
  Shield, FileCheck, ArrowLeft, ChevronDown,
  ChevronUp, FileText, Clock, Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import FileUpload from '../components/FileUpload';
import ProcessingStatus from '../components/ProcessingStatus';
import HashPreview from '../components/HashPreview';
import ExtractedFields from '../components/ExtractedFields';
import useDocumentProcessing from '../hooks/useDocumentProcessing';

/**
 * TestProcessing — End-to-end browser-side document processing demo.
 * Upload → Process → View hash, OCR text, and extracted fields.
 */
const TestProcessing = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOcrText, setShowOcrText]   = useState(false);
  const [showNorm, setShowNorm]         = useState(false);

  const {
    processDocument,
    loading,
    progress,
    result,
    error,
    reset,
  } = useDocumentProcessing();

  const navigate = useNavigate();

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    reset();
  }, [reset]);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    reset();
  }, [reset]);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;
    try {
      await processDocument(selectedFile);
    } catch {
      // Error is surfaced via the hook's error state
    }
  }, [selectedFile, processDocument]);

  return (
    <Box
      minH="100vh"
      bg="black"
      color="white"
      py={8}
      px={4}
    >
      <Box maxW="720px" mx="auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <Flex align="center" gap={3} mb={8}>
          <Box
            as="button"
            onClick={() => navigate('/dashboard')}
            color="whiteAlpha.400"
            _hover={{ color: 'white' }}
            transition="color 0.2s"
          >
            <ArrowLeft size={20} />
          </Box>
          <Box
            boxSize={12}
            bg="green.950"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="green.800"
          >
            <Shield size={22} color="#68d391" />
          </Box>
          <Box>
            <Text fontWeight="black" fontSize="xl" letterSpacing="tight">
              Document Processing
            </Text>
            <Text fontSize="xs" color="whiteAlpha.400">
              Browser-side semantic analysis pipeline
            </Text>
          </Box>
        </Flex>

        <Stack gap={6}>

          {/* ── Step 1: Upload ───────────────────────────────────────── */}
          <Box
            p={6}
            bg="rgba(255,255,255,0.02)"
            borderWidth={1}
            borderColor="whiteAlpha.80"
            borderRadius="2xl"
          >
            <Flex align="center" gap={2} mb={4}>
              <Badge
                bg="green.500"
                color="black"
                borderRadius="full"
                boxSize={6}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="black"
              >
                1
              </Badge>
              <Text fontWeight="bold" fontSize="sm" color="white">
                Upload Document
              </Text>
            </Flex>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClear={handleClear}
              disabled={loading}
            />
          </Box>

          {/* ── Step 2: Process ──────────────────────────────────────── */}
          {selectedFile && !result && (
            <Button
              onClick={handleProcess}
              colorPalette="green"
              size="lg"
              width="full"
              loading={loading}
              loadingText="Processing..."
              borderRadius="full"
              fontWeight="bold"
              boxShadow="0 0 25px rgba(72,187,120,0.2)"
              _hover={{ boxShadow: '0 0 40px rgba(72,187,120,0.35)', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              disabled={loading}
            >
              <FileCheck size={18} />
              Process Document
            </Button>
          )}

          {/* ── Processing status ────────────────────────────────────── */}
          {(loading || error) && (
            <ProcessingStatus
              stage={progress.stage}
              percent={progress.percent}
              loading={loading}
              error={error}
            />
          )}

          {/* ── Results ─────────────────────────────────────────────── */}
          {result && (
            <Stack gap={5}>

              {/* Meta stats */}
              <Flex gap={3} flexWrap="wrap">
                {[
                  { icon: FileText, label: result.fileType, color: 'green' },
                  { icon: Layers, label: result.pageCount ? `${result.pageCount} page${result.pageCount > 1 ? 's' : ''}` : 'Image', color: 'blue' },
                  { icon: Clock, label: `${result.processingTimeMs}ms`, color: 'purple' },
                ].map(({ icon: Icon, label, color }) => (
                  <Box
                    key={label}
                    flex={1}
                    minW="100px"
                    p={4}
                    bg="whiteAlpha.50"
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor="whiteAlpha.80"
                    textAlign="center"
                  >
                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                      <Icon size={16} color={`var(--chakra-colors-${color}-400)`} />
                    </Box>
                    <Text fontSize="xs" color="whiteAlpha.500" fontWeight="bold">{label}</Text>
                  </Box>
                ))}
              </Flex>

              <Separator borderColor="whiteAlpha.80" />

              {/* Hash preview */}
              <HashPreview
                hash={result.documentHash}
                algorithm={result.hashAlgorithm}
                processingTime={result.processingTimeMs}
              />

              {/* Extracted fields */}
              <ExtractedFields
                fields={result.fields}
                fieldCompleteness={result.fieldCompleteness}
                ocrConfidence={result.ocrConfidence}
              />

              {/* OCR text (collapsible) */}
              {result.ocrText && (
                <Box
                  p={5}
                  bg="whiteAlpha.50"
                  borderWidth={1}
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                >
                  <Box
                    as="button"
                    type="button"
                    onClick={() => setShowOcrText(prev => !prev)}
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="bold" fontSize="sm" color="white">
                      OCR Extracted Text
                    </Text>
                    {showOcrText ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                  </Box>
                  {showOcrText && (
                    <Box
                      mt={4}
                      p={4}
                      bg="rgba(0,0,0,0.3)"
                      borderRadius="xl"
                      borderWidth={1}
                      borderColor="whiteAlpha.80"
                      maxH="300px"
                      overflowY="auto"
                    >
                      <Text
                        fontSize="xs"
                        color="whiteAlpha.600"
                        fontFamily="mono"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {result.ocrText}
                      </Text>
                    </Box>
                  )}
                </Box>
              )}

              {/* Normalized content (collapsible) */}
              {result.normalizedContent && (
                <Box
                  p={5}
                  bg="whiteAlpha.50"
                  borderWidth={1}
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                >
                  <Box
                    as="button"
                    type="button"
                    onClick={() => setShowNorm(prev => !prev)}
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="bold" fontSize="sm" color="white">
                      Normalized Content
                    </Text>
                    {showNorm ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                  </Box>
                  {showNorm && (
                    <Box
                      mt={4}
                      p={4}
                      bg="rgba(0,0,0,0.3)"
                      borderRadius="xl"
                      borderWidth={1}
                      borderColor="whiteAlpha.80"
                      maxH="200px"
                      overflowY="auto"
                    >
                      <Text
                        fontSize="xs"
                        color="whiteAlpha.500"
                        fontFamily="mono"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {result.normalizedContent.slice(0, 2000)}
                        {result.normalizedContent.length > 2000 && '...'}
                      </Text>
                    </Box>
                  )}
                </Box>
              )}

              {/* Re-process button */}
              <Button
                onClick={handleClear}
                variant="outline"
                borderColor="whiteAlpha.200"
                color="whiteAlpha.600"
                _hover={{ borderColor: 'green.500', color: 'green.400' }}
                borderRadius="full"
                size="lg"
                w="full"
              >
                Process Another Document
              </Button>
            </Stack>
          )}

        </Stack>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <Text textAlign="center" fontSize="10px" color="whiteAlpha.200" mt={10}>
          All processing happens in your browser — no files are uploaded to any server.
        </Text>

      </Box>
    </Box>
  );
};

export default TestProcessing;
