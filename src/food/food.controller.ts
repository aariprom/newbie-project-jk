import { Get, Post, Req, Res, Controller } from '@nestjs/common';
import { Prisma, Food } from '@prisma/client';
import { FoodService } from './food.service';
import { PrismaService } from '../prisma.service';
import { XlsxService } from './xlsx/xlsx.service';

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

  @Get('/init')
  async init() {
    return this.xlsxService.init();
  }
}
