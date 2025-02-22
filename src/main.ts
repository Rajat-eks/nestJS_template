import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './providers/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  try {
    const configService = app.get(ConfigService);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    // app.useGlobalInterceptors(new TransformResponseInterceptor());

    // Use cookie-parser middleware
    app.use(cookieParser());

    app.setGlobalPrefix('/api/v1');
    await app.listen(configService.get('APP.APP_PORT') || 3000);

    logger.log(
      `Application is running on: ${configService.get('APP.APP_URL')}/${configService.get('APP.APP_PORT')} `,
    );
  } catch (error) {
    logger.error('Error starting the application:', error);
  }
}
bootstrap();
