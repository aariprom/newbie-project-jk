import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FoodResDto } from '../dto/foodRes.dto';

@Injectable()
export class FavFoodService {
  constructor(private readonly prisma: PrismaService) {}

  async createFavFood(userId: string, foodId: number): Promise<any> {
    const food = await this.prisma.favFood.create({
      data: {
        User: {
          connect: { id: userId },
        },
        Food: {
          connect: { id: foodId },
        },
      },
      select: {
        Food: {
          select: {
            id: true,
            calories: true,
            carbohydrates: true,
            protein: true,
            fat: true,
            sugars: true,
            sodium: true,
          }
        }
      }
    });
    return new FoodResDto(food.Food);
  }

  async deleteFavFood(userId: string, foodId: number): Promise<void> {
    this.prisma.favFood.deleteMany({
      where:
        {
          userId: userId,
          foodId: foodId,
        },
    });
  }

  async getFavFood(userId: string): Promise<FoodResDto[]> {
    const foods = await this.prisma.favFood.findMany({
      where: {
        userId: userId,
      },
      select: {
        Food: {
          select: {
            id: true,
            calories: true,
            carbohydrates: true,
            protein: true,
            fat: true,
            sugars: true,
            sodium: true,
          }
        }
      },
    });
    return foods.map(food => new FoodResDto(food.Food));
  }
}
