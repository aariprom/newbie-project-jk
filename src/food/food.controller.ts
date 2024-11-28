import { Get, Query, Post, Delete, Controller, Body, UseGuards, Param, Req } from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavFoodService } from './favFood/favFood.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService,
              private readonly favFoodService: FavFoodService,) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  async search(@Query() query: any) {
    console.log('[food.controller] search() | query: ', query);
    return this.foodService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Req() req: any, @Body() body: any) {
    const payload: any = await req.payload;
    const userId = payload.userId;
    console.log('[food.controller] create() | body: ', body, 'userId: ', userId);
    return this.foodService.create(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:foodId')
  async delete(@Param('foodId') foodId: number) {
    console.log('[food.controller] delete() | foodId: ', foodId);
    return this.foodService.delete(foodId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addToFav/:foodId')
  async addToFav(@Req() req: any, @Param('foodId') foodId: any) {
    const payload: any = await req.payload;
    const userId = payload.userId;
    console.log('[food.controller] addToFav()');
    return this.favFoodService.createFavFood(userId, foodId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delFromFav/:foodId')
  async delFromFav(@Req() req: any, @Param('foodId') foodId: number) {
    const payload: any = await req.payload;
    const userId = payload.userId;
    console.log('[food.controller] deleteFromFav()');
    return this.favFoodService.deleteFavFood(userId, foodId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favFood')
  async readFavFood(@Req() req: any) {
    const payload: any = await req.payload;
    const userId = payload.userId;
    console.log('[food.controller] readFavFood()');
    return this.favFoodService.getFavFood(userId)
  }

/*
  @Get('/syncTest')
  async syncTest() {
    const jsonArray = await this.xlsxService.readTest();
    console.log(jsonArray);
    return this.prisma.food.createMany({
      data: jsonArray,
    })
  }

  @Get('/readTest')
  async readTest() {
    const jsonArray = await this.xlsxService.readTest();
    console.log(jsonArray);
    return jsonArray;
  }

  @Get('/getTest')
  async getTest() {
    return this.xlsxService.getTest();
  }

    @Get('/reset')
  async reset() {
    return this.foodService.reset();
  }

  @Get('/init')
  async init() {
    return this.xlsxService.init();
  }
*/

}
