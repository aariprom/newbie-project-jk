import { DailyConsumeService } from '../dailyConsume.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { StatDto } from './dto/stat.dto';
import { AggregatedStatDto } from './dto/AggregatedStat.dto';

type NutrientStatus = {
  cal: "D" | "E",
  carbohydrate: "D" | "E",
  protein: "D" | "E",
  fat: "D" | "E",
  sugars: "D" | "E",
  sodium: "D" | "E",
};

type Count = {
  cal: {
    deficient: number,
    exceeded: number,
  },
  carbohydrates: {
    deficient: number,
    exceeded: number,
  },
  protein: {
    deficient: number,
    exceeded: number,
  },
  fat: {
    deficient: number,
    exceeded: number,
  },
  sodium: {
    deficient: number,
    exceeded: number,
  },
  sugars: {
    deficient: number,
    exceeded: number,
  }
}
@Injectable()
export class StatService {
  constructor(private readonly dailyConsumeService: DailyConsumeService,
              private readonly prisma: PrismaService) {}

  onModuleInit() {
    if (!this.prisma) {
      console.error('PrismaService is undefined in StatService!');
    } else {
      console.log('PrismaService is successfully injected in StatService!');
    }
  }

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

    /*
    todo:
     return array of foods that fits diff array
     each food should? contain foodId, name, and nutrients
     frontend will support to instantly add recommended food to diet
    const recommendations =
     */

    return {
      stat: new StatDto(stat),
      count: count,
    };
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

    if (diets.length === 0) {
      throw new NotFoundException('No diet found for the given date.');
    }

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
    const diff = {
      excessCarb: stat.carbohydrates - ref.carbohydrates[1],
      deficientCarb: ref.carbohydrates[0] - stat.carbohydrates,
      excessProtein: stat.protein - ref.protein[1],
      deficientProtein: ref.protein[0] - stat.protein,
      excessFat: stat.fat - ref.fat[1],
      deficientFat: ref.fat[0] - stat.fat,
    };

    if (ref.cal < stat.calories * 0.7) {
      msg.cal = 'E';
    } else if (ref.cal > stat.calories * 1.3) {
      msg.cal = 'D';
    }
    if (diff.deficientCarb > 0) {
      msg.carbohydrates = 'D';
    } else if (diff.excessCarb > 0) {
      msg.carbohydrates = 'E';
    }
    if (diff.deficientFat > 0) {
      msg.fat = 'D';
    } else if (diff.excessFat > 0) {
      msg.fat = 'E';
    }
    if (diff.deficientProtein > 0) {
      msg.protein = 'D';
    } else if (diff.excessProtein > 0) {
      msg.protein = 'E';
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
}