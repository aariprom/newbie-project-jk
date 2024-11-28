import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DietService } from './diet.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { EditDietDto } from './dto/editDiet.dto';
import { CreateDietReqDto } from './dto/createDietReq.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Post()
  async createDiet(@CurrentUser() user: User, @Body() body: CreateDietReqDto) {
    return this.dietService.createDiet(user.id, body);
  }

  @Get()
  async getDietOfUser(@CurrentUser() user: User) {
    return this.dietService.getDietByUserId(user.id);
  }

  @Get('/:dietId')
  async getDiet(@Param('dietId', ParseIntPipe) dietId: number) {
    return this.dietService.getDietByDietId(dietId)
  }

  @Delete('/:dietId')
  async deleteDiet(@Param('dietId', ParseIntPipe) dietId: number) {
    return this.dietService.deleteDiet(dietId);
  }

  @Patch('/:dietId')
  async editDiet(@Body() body: EditDietDto, @Param('dietId', ParseIntPipe) dietId: number) {
    return this.dietService.editDiet(body, dietId);
  }

  @Post('/:dietId/foods/:foodId')
  async addFoodInDiet(@Param('dietId', ParseIntPipe) dietId: number, @Param('foodId', ParseIntPipe) foodId: number) {
    return this.dietService.addFoodInDiet(dietId, foodId);
  }

  @Delete('/:dietId/foods/:foodId')
  async deleteFoodInDiet(@Param('dietId', ParseIntPipe) dietId: number, @Param('foodId', ParseIntPipe) foodId: number) {
    return this.dietService.removeFoodInDiet(dietId, foodId);
  }

  @Get('/:dietId/stat')
  async getDietStats(@CurrentUser() user: User, @Param('dietId', ParseIntPipe) dietId: number) {
    return this.dietService.getDietStats(user.id, dietId);
  }
}
