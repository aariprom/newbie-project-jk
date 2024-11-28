import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './exception.logger';
import { TokenInterceptor } from './token.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const configService = new ConfigService();
  app.use(cookieParser(configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET')));
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),  // The frontend URL (change this if your frontend is hosted elsewhere)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // HTTP methods allowed
    credentials: true,  // Allow cookies to be sent
  });
  app.useGlobalInterceptors(
    app.get(TokenInterceptor), // Here you get the interceptor from the DI container
  );
  /*app.useGlobalFilters(new GlobalExceptionFilter());*/
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
