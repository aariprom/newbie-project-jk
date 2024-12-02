import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDietReqDto } from './dto/createDietReq.dto';
import { PrismaService } from '../prisma.service';
import { DietResDto } from './dto/dietRes.dto';
import { FoodInDietResDto } from './dto/foodInDietRes.dto';
import { IsPostedDto } from './dto/isPosted.dto';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiet(userId: string, data: CreateDietReqDto): Promise<DietResDto> {
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

  async deleteDiet(dietId: number): Promise<void> {
    const diet = await this.prisma.diet.delete({
      where: {
        id: dietId,
      }
    });
    if (!diet) {
      throw new NotFoundException('No diets are found for given diet id.');
    }
  }

  async editDiet(data: any, dietId: number): Promise<DietResDto> {
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
    if (!diet) {
      throw new NotFoundException('No diets are found for given diet id.');
    }
    return new DietResDto(diet);
  }

  async getDietByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    if (!user) {
      throw new NotFoundException('No users found for given user id.');
    }
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
            food: {
              select: {
                id: true,
                name: true,
              }
            }
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
    return diets.map(diet => new DietResDto(diet));
  }

  async isDietPosted(dietId: number) {
    const post = await this.prisma.post.findMany({
      where: {
        dietId: dietId,
      },
    });
    if (post.length !== 0) {
      return new IsPostedDto({ exists: true, postId: post[0].id })
    } else {
      return new IsPostedDto({ exists: false })
    }
  }
}

