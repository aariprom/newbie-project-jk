import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDietReqDto } from './dto/createDietReq.dto';
import { PrismaService } from '../prisma.service';
import { DailyConsumeService } from './dailyConsume.service';
import { DietResDto } from './dto/dietRes.dto';
import { FoodInDietResDto } from './dto/foodInDietRes.dto';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService,
              private readonly dailyConsumeService: DailyConsumeService,) {}

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

  async getDietStats(userId: string, dietId: number) {
    const foods = await this.prisma.diet.findUnique({
      where: {
        id: dietId,
      },
      select: {
        foods: {
          select: {
            food: true,
          }
        }
      },
    });

    const stat = {
      calories: 0,
      fat: 0,
      protein: 0,
      sugars: 0,
      carbohydrates: 0,
      sodium: 0,
      dietId: Number(dietId),
    };

    for (const food of foods.foods) {
      const f = food.food;
      stat.calories += f.calories;
      stat.fat += f.fat;
      stat.protein += f.protein;
      stat.sugars += f.sugars;
      stat.carbohydrates += f.carbohydrates;
      stat.sodium += f.sodium;
    }

    const alert = await this.alert(userId, stat);

    /*
    todo:
     return array of foods that fits diff array
     each food should? contain foodId, name, and nutrients
     frontend will support to instantly add recommended food to diet
    const recommendations =
     */

    return {
      stat: stat,
      alert: alert,
    };
  }

  async alert(userId: string, stat: { calories?: number; fat?: number; protein?: number; sugars?: number; carbohydrates?: number; sodium?: number; id?: any; }) {
    const ref = await this.dailyConsumeService.refStat(userId);
    const alertMessage: any = {};
    const diff = {
      upperCarbohydrates: ref.carbohydrates[1] - stat.carbohydrates,
      lowerCarbohydrates: ref.carbohydrates[0] - stat.carbohydrates,
      upperProtein: ref.protein[1] - stat.protein,
      lowerProtein: ref.protein[0] - stat.protein,
      upperFat: ref.fat[1] - stat.fat,
      lowerFat: ref.fat[0] - stat.fat,
    };

    if (ref.cal < stat.calories * 0.7) {
      alertMessage.cal = 'deficient';
    } else if (ref.cal > stat.calories * 1.3) {
      alertMessage.cal = 'excess';
    }
    if (diff.lowerCarbohydrates > 0) {
      alertMessage.carbohydrates = 'deficient';
    } else if (diff.upperCarbohydrates < 0) {
      alertMessage.carbohydrates = 'excess';
    }
    if (diff.lowerFat > 0) {
      alertMessage.fat = 'deficient';
    } else if (diff.upperFat < 0) {
      alertMessage.fat = 'excess';
    }
    if (diff.lowerProtein > 0) {
      alertMessage.protein = 'deficient';
    } else if (diff.upperProtein < 0) {
      alertMessage.protein = 'excess';
    }
    if (ref.sugars < stat.sugars * 0.7) {
      alertMessage.sugars = 'deficient';
    } else if (ref.sugars > stat.sugars * 1.3) {
      alertMessage.sugars = 'excess';
    }
    if (ref.sodium < stat.sodium * 0.7) {
      alertMessage.sodium = 'deficient';
    } else if (ref.sodium > stat.sodium * 1.3) {
      alertMessage.sodium = 'excess';
    }
    return {
      diff: diff,
      message: alertMessage,
    };
  }
}
