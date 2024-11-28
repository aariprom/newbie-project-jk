import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FoodIdDTO } from '../dto/foodIdDTO';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FavFoodService {
  constructor(private readonly prisma: PrismaService) {}

  async createFavFood(userId: string, foodId: number): Promise<any> {
    return this.prisma.favoriteFood.create({
      data: {
        User: {
          connect: { id: userId },
        },
        Food: {
          connect: { id: foodId },
        },
      },
    });
  }

  async deleteFavFood(userId: string, foodId: number) {
    return this.prisma.favoriteFood.deleteMany({
      where:
        {
          userId: userId,
          foodId: foodId,
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
