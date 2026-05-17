import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Flex,
  Badge,
  Separator,
  Spinner,
  Progress,
  Clipboard,
  IconButton,
} from '@chakra-ui/react';
import {
  ScanEye,
  ArrowLeft,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Clock,
  Fingerprint,
  Copy,
  Check,
  CheckCircle,
  AlertCircle,
  FileType,
  Maximize2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ImageUpload from '../components/ImageUpload';
import ImagePreview from '../components/ImagePreview';
import OCRPreview from '../components/OCRPreview';
import SimilarityScore from '../components/SimilarityScore';
import useImageVerification from '../hooks/useImageVerification';
import { IMAGE_STAGES } from '../utils/imageVerificationProcessor';

/**
 * TestImageVerification — End-to-end browser-side image verification demo.
 * Upload → Process → View pHash, OCR text, extracted fields, and similarity scores.
 */
const TestImageVerification = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPHashInfo, setShowPHashInfo] = useState(false);

  const {
    processImage,
    loading,
    progress,
    result,
    error,
    reset,
  } = useImageVerification();

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
      await processImage(selectedFile);
    } catch {
      // Error is surfaced via the hook's error state
    }
  }, [selectedFile, processImage]);

  // ── Processing status helpers ──────────────────────────────────────────────
  const isComplete = progress.stage === IMAGE_STAGES.COMPLETE;
  const isError = !!error;

  return (
    <Box
      minH="100vh"
      bg="black"
      color="white"
      py={8}
      px={4}
    >
      <Box maxW="760px" mx="auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
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
            bg="purple.950"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="purple.800"
          >
            <ScanEye size={22} color="#b794f4" />
          </Box>
          <Box>
            <Text fontWeight="black" fontSize="xl" letterSpacing="tight">
              Image Verification
            </Text>
            <Text fontSize="xs" color="whiteAlpha.400">
              pHash + OCR browser-side verification pipeline
            </Text>
          </Box>
        </Flex>

        <Stack gap={6}>

          {/* ── Step 1: Upload ─────────────────────────────────────────── */}
          <Box
            p={6}
            bg="rgba(255,255,255,0.02)"
            borderWidth={1}
            borderColor="whiteAlpha.80"
            borderRadius="2xl"
          >
            <Flex align="center" gap={2} mb={4}>
              <Badge
                bg="purple.500"
                color="white"
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
                Upload Image
              </Text>
              <Badge variant="outline" borderColor="whiteAlpha.200" color="whiteAlpha.400" fontSize="9px" borderRadius="full">
                JPG / PNG
              </Badge>
            </Flex>
            <ImageUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClear={handleClear}
              disabled={loading}
            />
          </Box>

          {/* ── Image preview (when file selected) ────────────────────── */}
          {selectedFile && !result && !loading && (
            <ImagePreview file={selectedFile} />
          )}

          {/* ── Step 2: Process ────────────────────────────────────────── */}
          {selectedFile && !result && (
            <Button
              onClick={handleProcess}
              colorPalette="purple"
              size="lg"
              width="full"
              loading={loading}
              loadingText="Processing..."
              borderRadius="full"
              fontWeight="bold"
              boxShadow="0 0 25px rgba(183,148,244,0.2)"
              _hover={{ boxShadow: '0 0 40px rgba(183,148,244,0.35)', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              disabled={loading}
            >
              <ImagePlus size={18} />
              Process Image
            </Button>
          )}

          {/* ── Processing status ─────────────────────────────────────── */}
          {(loading || isError) && (
            <Box
              p={5}
              bg={isError ? 'rgba(239,68,68,0.06)' : isComplete ? 'rgba(183,148,244,0.06)' : 'whiteAlpha.50'}
              borderWidth={1}
              borderColor={isError ? 'red.500/30' : isComplete ? 'purple.500/30' : 'whiteAlpha.100'}
              borderRadius="2xl"
            >
              <Stack gap={4}>
                <Flex align="center" gap={3}>
                  {isError ? (
                    <AlertCircle size={18} color="#fc8181" />
                  ) : isComplete ? (
                    <CheckCircle size={18} color="#b794f4" />
                  ) : (
                    <Spinner size="sm" color="purple.400" borderWidth="2px" />
                  )}
                  <Box flex={1}>
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      color={isError ? 'red.400' : isComplete ? 'purple.400' : 'white'}
                    >
                      {isError ? 'Processing Failed' : isComplete ? 'Processing Complete' : 'Analyzing Image'}
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.500" mt={0.5}>
                      {isError ? error : progress.stage}
                    </Text>
                  </Box>
                  {!isError && (
                    <Badge
                      colorPalette={isComplete ? 'purple' : 'yellow'}
                      variant="surface"
                      fontSize="10px"
                      borderRadius="full"
                    >
                      {progress.percent}%
                    </Badge>
                  )}
                </Flex>

                {loading && !isError && (
                  <>
                    <Progress.Root value={progress.percent} size="xs" colorPalette="purple">
                      <Progress.Track bg="whiteAlpha.100" borderRadius="full">
                        <Progress.Range borderRadius="full" transition="width 0.4s ease" />
                      </Progress.Track>
                    </Progress.Root>

                    <Flex gap={2} flexWrap="wrap">
                      {[
                        { label: 'Preprocess', done: progress.percent > 10 },
                        { label: 'pHash',      done: progress.percent > 25 },
                        { label: 'OCR',        done: progress.percent > 80 },
                        { label: 'Fields',     done: progress.percent > 90 },
                      ].map(({ label, done }) => (
                        <Badge
                          key={label}
                          variant={done ? 'solid' : 'outline'}
                          colorPalette={done ? 'purple' : 'gray'}
                          borderRadius="full"
                          fontSize="9px"
                          px={2}
                          py={0.5}
                        >
                          {label}
                        </Badge>
                      ))}
                    </Flex>
                  </>
                )}
              </Stack>
            </Box>
          )}

          {/* ── Results ───────────────────────────────────────────────── */}
          {result && (
            <Stack gap={5}>

              {/* Meta stats */}
              <Flex gap={3} flexWrap="wrap">
                {[
                  { icon: FileType, label: 'IMAGE', color: 'purple' },
                  { icon: Maximize2, label: `${result.imageDimensions?.original?.width}×${result.imageDimensions?.original?.height}`, color: 'blue' },
                  { icon: Clock, label: `${result.processingTimeMs}ms`, color: 'green' },
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

              {/* pHash display */}
              <Box
                p={5}
                bg="rgba(183,148,244,0.04)"
                borderWidth={1}
                borderColor="purple.500/20"
                borderRadius="2xl"
              >
                <Flex align="center" gap={3} mb={4}>
                  <Box
                    boxSize={10}
                    bg="purple.950"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={1}
                    borderColor="purple.800"
                  >
                    <Fingerprint size={18} color="#b794f4" />
                  </Box>
                  <Box flex={1}>
                    <Text fontWeight="bold" fontSize="sm" color="white">
                      Perceptual Hash
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.400">
                      Visual fingerprint — tolerates rescans &amp; screenshots
                    </Text>
                  </Box>
                  <Badge colorPalette="purple" variant="surface" fontSize="10px" borderRadius="full">
                    pHash
                  </Badge>
                </Flex>

                <Box
                  p={4}
                  bg="rgba(0,0,0,0.3)"
                  borderRadius="xl"
                  borderWidth={1}
                  borderColor="whiteAlpha.80"
                >
                  <Clipboard.Root value={result.pHash}>
                    <Flex align="center" gap={3}>
                      <Text
                        fontFamily="mono"
                        fontSize="xs"
                        color="purple.300"
                        letterSpacing="wider"
                        wordBreak="break-all"
                        flex={1}
                        title={result.pHash}
                      >
                        {result.pHash.length > 40
                          ? `${result.pHash.slice(0, 20)}...${result.pHash.slice(-20)}`
                          : result.pHash
                        }
                      </Text>
                      <Clipboard.Trigger asChild>
                        <IconButton
                          size="xs"
                          variant="ghost"
                          color="whiteAlpha.400"
                          _hover={{ color: 'purple.400', bg: 'whiteAlpha.100' }}
                          aria-label="Copy pHash"
                        >
                          <Clipboard.Indicator copied={<Check size={14} />}>
                            <Copy size={14} />
                          </Clipboard.Indicator>
                        </IconButton>
                      </Clipboard.Trigger>
                    </Flex>
                  </Clipboard.Root>
                </Box>

                {/* pHash info toggle */}
                <Box
                  as="button"
                  type="button"
                  onClick={() => setShowPHashInfo(prev => !prev)}
                  mt={3}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="whiteAlpha.300"
                  fontSize="10px"
                  _hover={{ color: 'whiteAlpha.500' }}
                  transition="color 0.2s"
                >
                  {showPHashInfo ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showPHashInfo ? 'Hide details' : 'What is pHash?'}
                </Box>
                {showPHashInfo && (
                  <Box mt={2} px={3} py={2} bg="whiteAlpha.50" borderRadius="lg">
                    <Text fontSize="10px" color="whiteAlpha.400" lineHeight="tall">
                      A perceptual hash generates a visual fingerprint of an image.
                      Unlike SHA-256, it tolerates screenshots, rescans, compression,
                      and brightness changes — making it ideal for verifying scanned
                      or photographed documents.
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Image preview with processed version */}
              <ImagePreview
                file={selectedFile}
                preprocessedUrl={result.preprocessedPreview}
                dimensions={result.imageDimensions}
              />

              {/* OCR + Fields */}
              <OCRPreview
                ocrText={result.ocrText}
                fields={result.fields}
                completeness={result.fieldCompleteness}
                confidence={result.ocrConfidence}
                wordCount={result.ocrWordCount}
              />

              {/* Similarity scores — demo mode with self-comparison (100%) */}
              <SimilarityScore
                visualSimilarity={100}
                ocrSimilarity={result.ocrConfidence || 0}
                fieldSimilarity={result.fieldCompleteness?.percentage || 0}
                overallConfidence={
                  Math.round(
                    0.30 * 100 +
                    0.30 * (result.ocrConfidence || 0) +
                    0.40 * (result.fieldCompleteness?.percentage || 0)
                  )
                }
              />

              {/* Re-process button */}
              <Button
                onClick={handleClear}
                variant="outline"
                borderColor="whiteAlpha.200"
                color="whiteAlpha.600"
                _hover={{ borderColor: 'purple.500', color: 'purple.400' }}
                borderRadius="full"
                size="lg"
                w="full"
              >
                Process Another Image
              </Button>
            </Stack>
          )}

        </Stack>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <Text textAlign="center" fontSize="10px" color="whiteAlpha.200" mt={10}>
          All processing happens in your browser — no images are uploaded to any server.
        </Text>

      </Box>
    </Box>
  );
};

export default TestImageVerification;
