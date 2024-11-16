import { Get, Query, Post, Req, Res, Controller, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Prisma, Food } from '@prisma/client';
import { FoodService } from './food.service';
import { PrismaService } from '../prisma.service';
import { XlsxService } from './xlsx/xlsx.service';
import { foodSearchQueryDto } from './dto/foodSearchQuery.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService,
              private readonly prisma: PrismaService,
              private readonly xlsxService: XlsxService,) {
  }

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
    return this.xlsxService.reset();
  }

  @Get('/init')
  async init() {
    return this.xlsxService.init();
  }

  @Get('/search')
  async search(@Query(new ValidationPipe({ transform: true, whitelist: true })) query: foodSearchQueryDto,) {
    console.log('[food.controller.ts] query:', query);
    return this.xlsxService.search(query);
  }
}
