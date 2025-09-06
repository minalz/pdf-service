import { Injectable, Logger } from '@nestjs/common';
import puppeteer, {Browser} from 'puppeteer';
import { createPool } from 'generic-pool';
import type { PdfRequest } from './dto/pdf-request.dto';
import { writeFileSync } from 'fs';
import * as PDF_OPTIONS from './pdf.options.json'

@Injectable()
export class PdfService {
    private readonly logger = new Logger(PdfService.name);
    private readonly pool = createPool<Browser>({
        create: async () =>
            puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            }),
        destroy: async (b) => b.close(),
    }, { min: 1, max: 4 });

    async generate({ html, options }: PdfRequest): Promise<Buffer> {
        writeFileSync('/tmp/received.html', html);   // Windows 用 D:\\received.html
        this.logger.log('>>>> HTML 已写入 /tmp/received.html');
        const browser = await this.pool.acquire();
        const page = await browser.newPage();
        try {
            await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
            let headerTemplate = '';
            let footerTemplate = '';
            if (options && options.displayHeaderFooter) {
                headerTemplate = (PDF_OPTIONS.headerTemplate || '')
                    .replace('{{title}}', '2025 年度销售报表')
                    .replace('{{createTime}}', new Date().toLocaleString('zh-CN'));

                footerTemplate = (PDF_OPTIONS.footerTemplate || '')
                    .replace('{{title}}', '2025 年度销售报表')
                    .replace('{{createTime}}', new Date().toLocaleString('zh-CN'));
            }

            const buf = await page.pdf({
                format: options?.format ?? 'A4',
                printBackground: options?.printBackground ?? true,
                margin: options?.margin ?? { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
                ...options,
                displayHeaderFooter: options?.displayHeaderFooter ?? true,
                headerTemplate: options?headerTemplate : '',
                footerTemplate: options?footerTemplate : '',
            });
            return Buffer.from(buf);
        } finally {
            await page.close();
            await this.pool.release(browser);
        }
    }
}