import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { PrismaService } from '../prisma.service';
import { XlsxService } from './xlsx/xlsx.service';
import { FavFoodService } from './favFood/favFood.service';

@Module({
  controllers: [FoodController],
  providers: [FoodService, PrismaService, XlsxService, FavFoodService],
})
export class FoodModule {}
