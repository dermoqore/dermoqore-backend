import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://dermoqore-client-lyart.vercel.app',
      'https://www.dermoqore-client-lyart.vercel.app',
      'https://dermoqore-admin.vercel.app',
      'https://www.dermoqore-admin.vercel.app',
      'https://dermoqore.com',
      'https://www.dermoqore.com',
      'https://admin.dermoqore.com',
      'https://www.admin.dermoqore.com',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
