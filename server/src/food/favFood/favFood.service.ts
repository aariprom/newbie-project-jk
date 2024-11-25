import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FavFoodDto } from '../dto/favFoodDto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FavFoodService {
  constructor(private readonly prisma: PrismaService) {}

  async createFavFood(userId: string, foodId: any): Promise<any> {
    const validateFoodId = plainToInstance(FavFoodDto, foodId);
    const validationErrors = await validate(validateFoodId);
    if (validationErrors.length > 0) {
      console.log('[post.service] createFavFood() | validationError: ', validationErrors);
      throw new HttpException('Invalid food id for handling favFood API.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.favoriteFood.create({
      data: {
        User: {
          connect: { id: userId },
        },
        Food: {
          connect: { id: validateFoodId.foodId },
        },
      },
    });
  }

  async deleteFavFood(userId: string, foodId: number) {
    const validateFoodId = plainToInstance(FavFoodDto, foodId);
    const validationErrors = await validate(validateFoodId);
    if (validationErrors.length > 0) {
      console.log('[post.service] createFavFood() | validationError: ', validationErrors);
      throw new HttpException('Invalid food id for handling favFood API.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.favoriteFood.deleteMany({
      where:
        {
          userId: userId,
          foodId: validateFoodId.foodId,
        },
    });
  }

  async getFavFood(userId: string) {
    return this.prisma.favoriteFood.findMany({
      where: {
        userId: userId,
      },
      include: {
        Food: true
      },
    });
  }
}
