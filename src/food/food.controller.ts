import { Get, Query, Post, Req, Res, Controller, HttpStatus, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { XlsxService } from './xlsx/xlsx.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth.guard';
import { UserId } from '../user-id.decorator';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService,
              private readonly xlsxService: XlsxService,) {
  }

  @Get('/reset')
  async reset() {
    return this.foodService.reset();
  }

  @Get('/init')
  async init() {
    return this.xlsxService.init();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  async search(@Query() query: any) {
    console.log('[food.controller.ts] search() | query: ', query);
    return this.foodService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@UserId() userId: string, @Body() body: any) {
    console.log('[food.controller.ts] create() | body: ', body, 'userId: ', userId);
    return this.foodService.create(userId, body);
  }

  /*@Get('/syncTest')
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
  }*/

}
