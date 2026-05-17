/**
 * extractPdfContent
 *
 * Extracts readable semantic text from a PDF file using pdfjs-dist.
 * Focuses on SEMANTIC CONTENT — ignores raw binary structure,
 * metadata, compression artifacts, and formatting noise.
 *
 * @param {File} file — PDF File object
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker — load from node_modules via Vite's ?url import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractPdfContent = async (file) => {
  if (!file) throw new Error('No file provided for PDF extraction');

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageCount = pdf.numPages;
  const pageTexts = [];

  // Extract text from each page sequentially
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Build readable text from text items
    // pdfjs returns an array of text items with str (string) and transform (position)
    const pageText = textContent.items
      .filter((item) => item.str && item.str.trim())
      .map((item) => item.str)
      .join(' ');

    if (pageText.trim()) {
      pageTexts.push(pageText.trim());
    }
  }

  const text = pageTexts.join('\n');

  return {
    text,
    pageCount,
  };
};
