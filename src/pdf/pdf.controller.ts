import { Controller, Post, Body, Res, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import type { PdfRequest } from './dto/pdf-request.dto';
import type { Response } from 'express';

@Controller('api/pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  async download(
      @Body() body: PdfRequest,
      @Res({ passthrough: true }) res: Response,
  ) {
    const pdfBuffer = await this.pdfService.generate(body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report_${Date.now()}.pdf"`,
    });
    return new StreamableFile(pdfBuffer);
  }
}