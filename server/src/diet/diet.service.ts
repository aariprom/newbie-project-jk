import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDietReqDto } from './dto/createDietReq.dto';
import { PrismaService } from '../prisma.service';
import { DietResDto } from './dto/dietRes.dto';
import { FoodInDietResDto } from './dto/foodInDietRes.dto';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    if (!this.prisma) {
      console.error('PrismaService is undefined in DietService!');
    } else {
      console.log('PrismaService is successfully injected in DietService!');
    }
  }
  async createDiet(userId: string, data: CreateDietReqDto) {
    const diet = await this.prisma.diet.create({
      data: {
        ...data,
        foods: {
          createMany: {
            data: data.foods.map((foodId) => ({ foodId })),
          }
        },
        user: {
          connect: {
            id: userId,
          }
        }
      },
      select: {
        id: true,
        userId: true,
        foods: {
          select: {
            foodId: true,
          }
        },
        type: true,
        date: true
      }
    });
    return new DietResDto(diet);
  }

  async deleteDiet(dietId: number) {
    return this.prisma.diet.delete({
      where: {
        id: dietId,
      }
    });
  }

  async editDiet(data: any, dietId: number) {
    const diet = await this.prisma.diet.update({
      where: {
        id: dietId,
      },
      data: data,
      select: {
        id: true,
        userId: true,
        foods: {
          select: {
            foodId: true,
          }
        },
        type: true,
        date: true,
      }
    });
    return new DietResDto(diet);
  }

  async getDietByUserId(userId: string) {
    const diets = await this.prisma.diet.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        foods: {
          select: {
            foodId: true,
          }
        },
        type: true,
        date: true,
      },
    });
    return diets.map(diet => new DietResDto(diet));
  }

  async getDietByDietId(dietId: number) {
    const diet = await this.prisma.diet.findUnique({
      where: {
        id: dietId,
      },
      select: {
        id: true,
        userId: true,
        foods: {
          select: {
            foodId: true,
          }
        },
        type: true,
        date: true,
      },
    });
    if (!diet) {
      throw new NotFoundException('Diet not found.');
    }
    return new DietResDto(diet);
  }

  async addFoodInDiet(dietId: number, foodId: number) {
    const food = await this.prisma.foodsInDiet.create({
      data: {
        dietId: dietId,
        foodId: foodId,
      },
    });
    return new FoodInDietResDto(food);
  }

  async removeFoodInDiet(dietId: number, foodId: number) {
    return this.prisma.foodsInDiet.deleteMany({
      where: {
        dietId: dietId,
        foodId: foodId,
      },
    });
  }

  async getDietByDate(userId: string, date: Date) {
    const diets = await this.prisma.diet.findMany({
      where: {
        date: date,
        userId: userId,
      },
      select: {
        id: true,
        type: true,
        date: true,
        userId: true,
        foods: {
          select: {
            food: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });
    if (diets.length === 0 || !diets) {
      throw new NotFoundException('No diets found for given date.');
    }
    return diets.map(diet => new DietResDto(diet));
  }
}

