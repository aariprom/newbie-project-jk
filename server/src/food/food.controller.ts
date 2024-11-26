import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { FavFoodService } from './favFood/favFood.service';
import { XlsxService } from './xlsx/xlsx.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { createFoodDto } from './dto/createFood.dto';
import { searchFoodQueryDto } from './dto/searchFoodQueryDto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService,
              private readonly favFoodService: FavFoodService,
              private readonly xlsxService: XlsxService,) {
  }

  @Get('/search')
  async search(@Query() query: searchFoodQueryDto) {
    return this.foodService.search(query);
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() body: createFoodDto) {
    return this.foodService.create(user.id, body);
  }

  @Delete('/:foodId')
  async delete(@Param('foodId', ParseIntPipe) foodId: number) {
    return this.foodService.delete(foodId);
  }

  @Get('/fav')
  async readFavFood(@CurrentUser() user: User) {
    return this.favFoodService.getFavFood(user.id);
  }

  @Post('/fav/:foodId')
  async addToFav(@CurrentUser() user: User, @Param('foodId', ParseIntPipe) foodId: number) {
    return this.favFoodService.createFavFood(user.id, foodId);
  }

  @Delete('/fav/:foodId')
  async delFromFav(@CurrentUser() user: User, @Param('foodId', ParseIntPipe) foodId: number) {
    return this.favFoodService.deleteFavFood(user.id, foodId);
  }

  /******************** local / dev only! ***********************/

  @Get('/reset')
  async reset() {
    return this.foodService.reset();
  }

  @Get('/init')
  async init() {
    return this.xlsxService.init();
  }

}
