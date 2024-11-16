import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { PrismaService } from '../prisma.service';
import { XlsxService } from './xlsx/xlsx.service';

@Module({
  controllers: [FoodController],
  providers: [FoodService, PrismaService, XlsxService],
})
export class FoodModule {}
