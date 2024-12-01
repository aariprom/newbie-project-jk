import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { FavFoodService } from './favFood/favFood.service';
import { XlsxService } from './xlsx/xlsx.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { createFoodDto } from './dto/createFood.dto';
import { searchFoodQueryDto } from './dto/searchFoodQueryDto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FoodResDto } from './dto/foodRes.dto';
import { ApiCommonErrorResponse } from '../swagger-common-response.decorator';

@ApiTags('Food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService,
              private readonly favFoodService: FavFoodService,
              private readonly xlsxService: XlsxService,) {
  }

  @Get('/search')
  @ApiResponse({ status: 200, description: 'Search food items.', type: [FoodResDto] })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. ' })
  async search(@Query() query: searchFoodQueryDto): Promise<FoodResDto[]> {
    return this.foodService.search(query);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Food item created successfully.', type: FoodResDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. ' })
  async create(@CurrentUser() user: User, @Body() body: createFoodDto): Promise<FoodResDto> {
    return this.foodService.create(user.id, body);
  }

  @Delete('/:foodId')
  @ApiResponse({ status: 204, description: 'Food item deleted successfully.' })
  @ApiCommonErrorResponse()
  async delete(
    @CurrentUser() user: User,
    @Param('foodId', ParseIntPipe) foodId: number
  ): Promise<string> {
    await this.foodService.delete(user.id, foodId);
    return 'Food item deleted successfully.';
  }

  @Get('/fav')
  @ApiResponse({ status: 200, description: 'Get favorite food items.', type: [FoodResDto] })
  @ApiCommonErrorResponse()
  async readFavFood(@CurrentUser() user: User) {
    return this.favFoodService.getFavFood(user.id);
  }

  @Post('/fav/:foodId')
  @ApiResponse({ status: 201, description: 'Added food item to favorites.', type: FoodResDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. ' })
  async addToFav(@CurrentUser() user: User, @Param('foodId', ParseIntPipe) foodId: number) {
    return this.favFoodService.createFavFood(user.id, foodId);
  }

  @Delete('/fav/:foodId')
  @ApiResponse({ status: 204, description: 'Removed food item from favorites.' })
  @ApiCommonErrorResponse()
  async delFromFav(@CurrentUser() user: User, @Param('foodId', ParseIntPipe) foodId: number) {
    await this.favFoodService.deleteFavFood(user.id, foodId);
    return 'Removed food item from favorites.'
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
