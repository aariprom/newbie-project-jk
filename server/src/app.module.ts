import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FoodModule } from './food/food.module';
import * as process from 'node:process';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { FavFoodModule } from './food/favFood/favFood.module';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { DietModule } from './diet/diet.module';
import { PrismaService } from './prisma/prisma.service';
import { TokenService } from './auth/token/token.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatModule } from './diet/stat/stat.module';
import { StatService } from './diet/stat/stat.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'development' ? './env/.env.development' :
      (process.env.NODE_ENV === 'production' ? './env/.env.production' : './env/.env.local'),
    isGlobal: true,}),
    PrismaModule,
    AuthModule,
    FoodModule,
    FavFoodModule,
    PostModule,
    DietModule,
    UploadModule,
    StatModule,
  ],
  controllers: [AppController,],
  providers: [PostService, AppService, JwtService, TokenService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      '*'
    )
  }
}
