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
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'development' ? './env/.env.development' :
      (process.env.NODE_ENV === 'production' ? './env/.env.production' : './env/.env.local'),
    isGlobal: true,}),
      AuthModule,
      FoodModule,
      FavFoodModule,
      PostModule,
      DietModule,
  ],
  controllers: [AppController, AuthController, PostController],
  providers: [PostService, AppService, JwtService, PostService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      '*'
    )
  }
}