import type { PDFOptions } from 'puppeteer';

export interface PdfRequest {
  html: string;
  options?: PDFOptions & { format?: string };
}