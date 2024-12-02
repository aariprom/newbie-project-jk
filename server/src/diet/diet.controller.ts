import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DietService } from './diet.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { EditDietDto } from './dto/editDiet.dto';
import { CreateDietReqDto } from './dto/createDietReq.dto';
import { StatService } from './stat/stat.service';
import { ApiResponse } from '@nestjs/swagger';
import { DietResDto } from './dto/dietRes.dto';
import { ApiCommonErrorResponse } from '../swagger-common-response.decorator';
import { FoodInDietResDto } from './dto/foodInDietRes.dto';
import { StatResDto } from './dto/statRes.dto';
import { AggregatedStatDto } from './stat/dto/AggregatedStat.dto';
import { IsPostedDto } from './dto/isPosted.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService,
              private readonly statService: StatService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Diet created successfully.', type: DietResDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. ' })
  async createDiet(@CurrentUser() user: User, @Body() body: CreateDietReqDto): Promise<DietResDto> {
    return this.dietService.createDiet(user.id, body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get diet of user. '})
  @ApiCommonErrorResponse()
  async getDietOfUser(@CurrentUser() user: User): Promise<DietResDto[]> {
    return this.dietService.getDietByUserId(user.id);
  }

  @Get('/:dietId')
  @ApiResponse({ status: 200, description: 'Get diet for given diet id. '})
  @ApiCommonErrorResponse()
  async getDiet(@Param('dietId', ParseIntPipe) dietId: number): Promise<DietResDto> {
    return this.dietService.getDietByDietId(dietId);
  }

  @Delete('/:dietId')
  @ApiResponse({ status: 204, description: 'Diet item deleted successfully.' })
  @ApiCommonErrorResponse()
  async deleteDiet(@Param('dietId', ParseIntPipe) dietId: number) {
    await this.dietService.deleteDiet(dietId);
    return 'Diet item deleted successfully.';
  }

  @Patch('/:dietId')
  @ApiResponse({ status: 200, description: 'Diet item patched successfully. ', type: DietResDto})
  @ApiCommonErrorResponse()
  async editDiet(@Body() body: EditDietDto, @Param('dietId', ParseIntPipe) dietId: number): Promise<DietResDto> {
    return this.dietService.editDiet(body, dietId);
  }

  @Post('/:dietId/foods/:foodId')
  @ApiResponse({ status: 201, description: 'Successfully created a food in diet. ', type: FoodInDietResDto })
  @ApiCommonErrorResponse()
  async addFoodInDiet(
    @Param('dietId', ParseIntPipe) dietId: number,
    @Param('foodId', ParseIntPipe) foodId: number): Promise<FoodInDietResDto> {
    return this.dietService.addFoodInDiet(dietId, foodId);
  }

  @Delete('/:dietId/foods/:foodId')
  @ApiResponse({ status: 204, description: 'Food item deleted successfully.' })
  @ApiCommonErrorResponse()
  async deleteFoodInDiet(@Param('dietId', ParseIntPipe) dietId: number, @Param('foodId', ParseIntPipe) foodId: number) {
    return this.dietService.removeFoodInDiet(dietId, foodId);
  }

  @Get('/:dietId/stat')
  @ApiResponse({ status: 200, description: 'Successfully get stats.', type: StatResDto})
  @ApiCommonErrorResponse()
  async getDietStats(
    @CurrentUser() user: User,
    @Param('dietId', ParseIntPipe) dietId: number
  ): Promise<StatResDto> {
    return this.statService.getDietStats(user.id, dietId);
  }

  @Get('/daily/:date')
  @ApiResponse({ status: 200, description: 'Successfully get diet item.', type: [DietResDto]})
  @ApiCommonErrorResponse()
  async getDailyDiets(
    @CurrentUser() user: User,
    @Param('date') date: string
  ): Promise<DietResDto[]> {
    const parsedDate = new Date(date);
    return this.dietService.getDietByDate(user.id, parsedDate);
  }

  @Get('/daily/:date/stat')
  @ApiResponse({ status: 200, description: 'Successfully get stat item.', type: [AggregatedStatDto]})
  @ApiCommonErrorResponse()
  async getDailyStats(
    @CurrentUser() user: User,
    @Param('date') date: string
  ): Promise<AggregatedStatDto> {
    const parsedDate = new Date(date);
    return this.statService.getDailyStats(user.id, parsedDate);
  }

  @Get('/monthly/:year/:month/stat')
  @ApiResponse({ status: 200, description: 'Successfully get stat item.', type: [AggregatedStatDto]})
  @ApiCommonErrorResponse()
  async getMonthlyStats(
    @CurrentUser() user: User,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<AggregatedStatDto> {
    return this.statService.getMonthlyStats(user.id, year, month);
  }

  @Get('/:dietId/check')
  async isDietPosted(@Param('dietId', ParseIntPipe) dietId: number): Promise<IsPostedDto> {
    return this.dietService.isDietPosted(dietId);
  }
}
