import { Module } from '@nestjs/common';
import { FavFoodService } from './favFood.service';
import { PrismaService } from '../../prisma.service';

@Module({
  providers: [FavFoodService, PrismaService],
  exports: [FavFoodService],
})
export class FavFoodModule {}
