import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { Image as ImageIcon, Maximize2, FileType } from 'lucide-react';

/**
 * ImagePreview — Displays the uploaded image with metadata.
 *
 * Props:
 *  - file:            File object
 *  - preprocessedUrl: string (processed preview data URL, optional)
 *  - dimensions:      { original: { width, height }, processed: { width, height } }
 */
const ImagePreview = ({ file, preprocessedUrl, dimensions }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file) return null;

  const ext = file.name?.split('.').pop()?.toUpperCase() || 'IMG';

  return (
    <Box
      p={5}
      bg="whiteAlpha.50"
      borderWidth={1}
      borderColor="whiteAlpha.100"
      borderRadius="2xl"
    >
      {/* Header */}
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
          <ImageIcon size={18} color="#b794f4" />
        </Box>
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm" color="white" lineClamp={1}>
            {file.name}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400">
            Image preview
          </Text>
        </Box>
        <Badge colorPalette="purple" variant="surface" fontSize="10px" borderRadius="full">
          {ext}
        </Badge>
      </Flex>

      {/* Image preview */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        borderWidth={1}
        borderColor="whiteAlpha.80"
        bg="rgba(0,0,0,0.3)"
        position="relative"
      >
        <Box
          as="img"
          src={previewUrl}
          alt={file.name}
          w="full"
          maxH="320px"
          objectFit="contain"
          display="block"
        />
      </Box>

      {/* Metadata row */}
      <Flex gap={3} mt={4} flexWrap="wrap">
        <Flex
          align="center"
          gap={2}
          px={3}
          py={2}
          bg="whiteAlpha.50"
          borderRadius="lg"
          borderWidth={1}
          borderColor="whiteAlpha.80"
        >
          <FileType size={12} color="rgba(255,255,255,0.4)" />
          <Text fontSize="10px" color="whiteAlpha.500" fontWeight="medium">
            {(file.size / 1024).toFixed(1)} KB
          </Text>
        </Flex>
        {dimensions?.original && (
          <Flex
            align="center"
            gap={2}
            px={3}
            py={2}
            bg="whiteAlpha.50"
            borderRadius="lg"
            borderWidth={1}
            borderColor="whiteAlpha.80"
          >
            <Maximize2 size={12} color="rgba(255,255,255,0.4)" />
            <Text fontSize="10px" color="whiteAlpha.500" fontWeight="medium">
              {dimensions.original.width} × {dimensions.original.height}
            </Text>
          </Flex>
        )}
        {dimensions?.processed && (
          <Flex
            align="center"
            gap={2}
            px={3}
            py={2}
            bg="whiteAlpha.50"
            borderRadius="lg"
            borderWidth={1}
            borderColor="whiteAlpha.80"
          >
            <Maximize2 size={12} color="rgba(255,255,255,0.4)" />
            <Text fontSize="10px" color="whiteAlpha.400" fontWeight="medium">
              Processed: {dimensions.processed.width} × {dimensions.processed.height}
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ImagePreview;
