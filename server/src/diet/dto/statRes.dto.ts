import { IsObject } from 'class-validator';
import { Count } from '../stat/type/count.type';
import { Diff } from '../stat/type/diff.type';
import { StatDto } from '../stat/dto/stat.dto';
import { FoodResDto } from '../../food/dto/foodRes.dto';

export class StatResDto {
  @IsObject()
  stat: StatDto;

  @IsObject()
  count: Count;

  @IsObject()
  diff: Diff;

  @IsObject()
  recommended: FoodResDto[];

  constructor(partial: Partial<StatResDto>) {
    Object.assign(this, partial);
  }
}