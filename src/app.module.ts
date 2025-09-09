import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),   // 静态目录
      serveRoot: '/',                              // URL 前缀
    }), PdfModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
