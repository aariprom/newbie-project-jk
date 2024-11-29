import { Module } from '@nestjs/common';
import { FavFoodService } from './favFood.service';

@Module({
  providers: [FavFoodService],
  exports: [FavFoodService],
})
export class FavFoodModule {}
