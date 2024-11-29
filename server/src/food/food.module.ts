import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { FavFoodService } from './favFood/favFood.service';
import { XlsxModule } from './xlsx/xlsx.module';

@Module({
  imports: [XlsxModule],
  controllers: [FoodController],
  providers: [FoodService, FavFoodService],
})
export class FoodModule {}
