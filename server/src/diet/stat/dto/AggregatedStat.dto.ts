import { IsObject } from 'class-validator';

export class AggregatedStatDto {
  @IsObject()
  stats: {
    calories: number;
    fat: number;
    protein: number;
    sugars: number;
    carbohydrates: number;
    sodium: number;
  };

  @IsObject()
  count: {
    [key: string]: {
      deficient: number;
      exceeded: number;
    };
  };

  constructor(stats: Partial<AggregatedStatDto['stats']>, count: AggregatedStatDto['count']) {
    this.stats = {
      calories: stats.calories || 0,
      fat: stats.fat || 0,
      protein: stats.protein || 0,
      sugars: stats.sugars || 0,
      carbohydrates: stats.carbohydrates || 0,
      sodium: stats.sodium || 0,
    };

    this.count = count;
  }
}