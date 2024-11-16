import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FoodModule } from './food/food.module';
import * as process from 'node:process';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'development' ? './env/.env.development' :
      (process.env.NODE_ENV === 'production' ? './env/.env.production' : './env/.env.local'),
    isGlobal: true,}),
      AuthModule,
      FoodModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
