import { DailyConsumeService } from '../dailyConsume.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatDto } from './dto/stat.dto';
import { AggregatedStatDto } from './dto/AggregatedStat.dto';
import { NutrientStatus } from './type/nutientStat.dto';
import { Count } from './type/count.type';
import { Diff } from './type/diff.type';
import { StatResDto } from '../dto/statRes.dto';
import { FoodResDto } from '../../food/dto/foodRes.dto';

@Injectable()
export class StatService {
  constructor(private readonly dailyConsumeService: DailyConsumeService,
              private readonly prisma: PrismaService) {}

  async getDietStats(userId: string, dietId: number) {
    const diet = await this.prisma.diet.findUnique({
      where: {
        id: dietId,
      },
      include: {
        foods: {
          select: {
            food: true,
          }
        }
      },
    });

    if (!diet) {
      throw new NotFoundException('Diet not found.');
    }

    const stat = {
      calories: 0,
      fat: 0,
      protein: 0,
      sugars: 0,
      carbohydrates: 0,
      sodium: 0,
      dietId: dietId,
    };

    for (const food of diet.foods) {
      const f = food.food;
      stat.calories += f.calories;
      stat.fat += f.fat;
      stat.protein += f.protein;
      stat.sugars += f.sugars;
      stat.carbohydrates += f.carbohydrates;
      stat.sodium += f.sodium;
    }

    const alert = await this.alert(userId, stat);
    const count = this.countNutrientIssues(alert.msg);
    const diff = alert.diff;

    const recommendations = await this.recommendedFoods(diff);

    return new StatResDto({ stat: new StatDto(stat), count: count, diff: diff, recommended: recommendations });
  }

  async getDailyStats(userId: string, date: Date) {
    const diets = await this.prisma.diet.findMany({
      where: {
        date: date,
      },
      select: {
        id: true,
      }
    });

    return this.aggregate(userId, diets);
  }

  async getMonthlyStats(userId: string, year: number, month: number): Promise<AggregatedStatDto> {
    const diets = await this.prisma.diet.findMany({
      where: {
        userId,
        date: {
          gte: new Date(year, month - 1, 1),  // First day of the month
          lt: new Date(year, month, 1),  // First day of the next month
        },
      },
      select: {
        id: true,
      },
    });

    if (!diets || diets.length === 0) {
      throw new NotFoundException('No diets found for the given month.');
    }

    return this.aggregate(userId, diets, true);
  }

  countNutrientIssues(result: NutrientStatus) {
    const count: Count = {
      cal: { deficient: 0, exceeded: 0 },
      carbohydrates: { deficient: 0, exceeded: 0 },
      fat: { deficient: 0, exceeded: 0 },
      protein: { deficient: 0, exceeded: 0 },
      sodium: { deficient: 0, exceeded: 0 },
      sugars: { deficient: 0, exceeded: 0 }
    };
      for (const nutrient in result) {
        const status = result[nutrient];
        if (status == 'D') {
          count[nutrient].deficient += 1;
        } else if (status == 'E') {
          count[nutrient].exceeded += 1;
        }
      }
    return count;
  }

  async aggregateNutrientCounts(counts: Count[]) {
    const aggregateCount: Count = {
      cal: { deficient: 0, exceeded: 0 },
      carbohydrates: { deficient: 0, exceeded: 0 },
      fat: { deficient: 0, exceeded: 0 },
      protein: { deficient: 0, exceeded: 0 },
      sodium: { deficient: 0, exceeded: 0 },
      sugars: { deficient: 0, exceeded: 0 }
    };

    for (const count of counts) {

      // Aggregate the count for each nutrient
      for (const nutrient in count) {
        if (!aggregateCount[nutrient]) {
          // Initialize the nutrient counts if not already present
          aggregateCount[nutrient] = { deficient: 0, exceeded: 0 };
        }

        // Add the counts from the current diet
        aggregateCount[nutrient].deficient += count[nutrient].deficient;
        aggregateCount[nutrient].exceeded += count[nutrient].exceeded;
      }
    }

    return aggregateCount;
  }

  async aggregate(userId: string, diets: any[], avg = false) {
    const statData = await Promise.all(diets.map(diet => this.getDietStats(userId, diet.id)));
    const stats = statData.map(data => data.stat);
    const counts = statData.map(data => data.count);
    console.log(stats, counts);
    const aggregatedStats = stats.reduce(
      (acc, stat) => {
        acc.calories += stat.calories;
        acc.protein += stat.protein;
        acc.carbohydrates += stat.carbohydrates;
        acc.fat += stat.fat;
        acc.sugars += stat.sugars;
        acc.sodium += stat.sodium;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, sugars: 0, sodium: 0 }
    );

    if (avg) {
      const numDiets = diets.length;
      aggregatedStats.calories /= numDiets;
      aggregatedStats.fat /= numDiets;
      aggregatedStats.protein /= numDiets;
      aggregatedStats.carbohydrates /= numDiets;
      aggregatedStats.sugars /= numDiets;
      aggregatedStats.sodium /= numDiets;
    }

    const aggregatedCounts = await this.aggregateNutrientCounts(counts);

    return new AggregatedStatDto(aggregatedStats, aggregatedCounts);
  }

  async alert(
    userId: string,
    stat: { calories?: number; fat?: number; protein?: number; sugars?: number; carbohydrates?: number; sodium?: number; id?: any; }
  ) {
    const ref = await this.dailyConsumeService.refStat(userId);
    const msg: any = {};
    const diff: Diff = {
      cal: stat.calories - ref.cal,
      carb: stat.carbohydrates - ref.carbohydrates,
      protein: stat.protein - ref.protein,
      fat: stat.fat - ref.fat,
      sugars: stat.sugars - ref.sugars,
      sodium: stat.sodium - ref.sodium,
    };

    if (ref.cal < stat.calories * 0.7) {
      msg.cal = 'E';
    } else if (ref.cal > stat.calories * 1.3) {
      msg.cal = 'D';
    }
    if (ref.carbohydrates < stat.carbohydrates * 0.7) {
      msg.carbohydrates = 'E';
    } else if (ref.carbohydrates > stat.carbohydrates * 1.3) {
      msg.carbohydrates = 'D';
    }
    if (ref.fat < stat.fat * 0.7) {
      msg.fat = 'E';
    } else if (ref.fat > stat.fat * 1.3) {
      msg.fat = 'D';
    }
    if (ref.protein < stat.protein * 0.7) {
      msg.protein = 'E';
    } else if (ref.protein > stat.protein * 1.3) {
      msg.protein = 'D';
    }
    if (ref.sugars < stat.sugars * 0.7) {
      msg.sugars = 'E';
    } else if (ref.sugars > stat.sugars * 1.3) {
      msg.sugars = 'D';
    }
    if (ref.sodium < stat.sodium * 0.7) {
      msg.sodium = 'E';
    } else if (ref.sodium > stat.sodium * 1.3) {
      msg.sodium = 'D';
    }
    return {
      diff: diff,
      msg: msg,
    };
  }

  async recommendedFoods(diff: Diff) {
    const nutrientConditions: any[] = [];

    if (diff.carb < 0) {
      nutrientConditions.push({ carbohydrates: { gte: Math.abs(diff.carb) } });
    } else if (diff.carb > 0) {
      nutrientConditions.push({ carbohydrates: { lte: diff.carb } });
    }

    if (diff.fat < 0) {
      nutrientConditions.push({ fat: { gte: Math.abs(diff.fat) } });
    } else if (diff.fat > 0) {
      nutrientConditions.push({ fat: { lte: diff.fat } });
    }

    if (diff.protein < 0) {
      nutrientConditions.push({ protein: { gte: Math.abs(diff.protein) } });
    } else if (diff.protein > 0) {
      nutrientConditions.push({ protein: { lte: diff.protein } });
    }

    if (diff.sugars < 0) {
      nutrientConditions.push({ sugars: { gte: Math.abs(diff.sugars) } });
    } else if (diff.sugars > 0) {
      nutrientConditions.push({ sugars: { lte: diff.sugars } });
    }

    if (diff.sodium < 0) {
      nutrientConditions.push({ sodium: { gte: Math.abs(diff.sodium) } });
    } else if (diff.sodium > 0) {
      nutrientConditions.push({ sodium: { lte: diff.sodium } });
    }

    const foods = await this.prisma.food.findMany({
      where: {
        AND: nutrientConditions,
      },
    });

    return foods.map(food => new FoodResDto(food));
  }
}