import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ① 全局 CORS 配置
  app.enableCors({
    origin: true,        // 或 ['http://localhost:3000']
    credentials: true,   // 允许带 cookie
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
