import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DietService } from './diet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createDiet')
  async createDiet(@Req() req: any, @Body() body: any) {
    const userId = await req['payload'].userId;
    return this.dietService.createDiet(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/editDiet/:dietId')
  async editDiet(@Body() body: any, @Param('dietId') dietId: number) {
    return this.dietService.editDiet(body, dietId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteDiet/:dietId')
  async deleteDiet(@Body() body: any, @Param('dietId') dietId: number) {
    return this.dietService.deleteDiet(body);
  }
}
