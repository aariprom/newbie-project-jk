import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { TokenInterceptor } from './token.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  /* swagger */
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // '/api' is the Swagger UI endpoint
  }
  /* validation pipe */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  /* jwt cookie parser */
  app.use(cookieParser(configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET')));
  /* CORS policy */
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),  // The frontend URL (change this if your frontend is hosted elsewhere)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // HTTP methods allowed
    credentials: true,  // Allow cookies to be sent
  });
  /* interceptor */
  app.useGlobalInterceptors(
    app.get(TokenInterceptor), // Here you get the interceptor from the DI container
  );
  /* exception logger */
  app.useGlobalFilters(new PrismaExceptionFilter());
  /* app.useGlobalFilters(new GlobalExceptionFilter()); */
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
