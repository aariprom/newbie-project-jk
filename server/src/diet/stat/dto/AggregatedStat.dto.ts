import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatDto } from './stat.dto';
import { Count } from '../type/count.type';

export class AggregatedStatDto {

  @ApiProperty({
    description: 'Aggregated nutritional stats',
    example: {
      calories: 250,
      fat: 10,
      protein: 15,
      sugars: 5,
      carbohydrates: 30,
      sodium: 200,
    },
  })
  @IsObject()
  stats: StatDto;

  @ApiProperty({
    description: 'Count of nutritional deficiencies and excesses',
    additionalProperties: {
      properties: {
        deficient: { type: 'number', example: 1 },
        exceeded: { type: 'number', example: 2 },
      },
    },
    example: {
      protein: { deficient: 1, exceeded: 0 },
      fat: { deficient: 0, exceeded: 2 },
    },
  })
  @IsObject()
  count: Count;

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