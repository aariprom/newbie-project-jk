import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createFoodDto } from './dto/createFood.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { searchFoodRequestQueryDto } from './dto/searchFoodRequestQuery.dto';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {};

  async search(searchParams: any) {
    const validatedParams = plainToInstance(searchFoodRequestQueryDto, searchParams);
    const validationErrors = await validate(validatedParams);
    console.log('[food.service.ts] search() | searchParams: ', searchParams);
    if (validationErrors.length > 0) {
      console.log('[food.service.ts] search() | validationErrors: ', validationErrors);
      throw new HttpException('Invalid request input for finding food.', HttpStatus.BAD_REQUEST);
    }

    const {
      name,
      type,
      category,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      minCarbohydrates,
      maxCarbohydrates,
      minFat,
      maxFat,
      minSugars,
      maxSugars,
      minSodium,
      maxSodium,
    } = validatedParams;

    return this.prisma.food.findMany({
      where: {
        ...(name && { name: { contains: name } }),
        ...(type && { type }),
        ...(category && { category }),
        ...(minCalories || maxCalories
          ? { calories: { gte: minCalories || 0, lte: maxCalories || undefined } }
          : {}),
        ...(minProtein || maxProtein
          ? { protein: { gte: minProtein || 0, lte: maxProtein || undefined } }
          : {}),
        ...(minCarbohydrates || maxCarbohydrates
          ? { carbohydrates: { gte: minCarbohydrates || 0, lte: maxCarbohydrates || undefined } }
          : {}),
        ...(minFat || maxFat
          ? { fat: { gte: minFat || 0, lte: maxFat || undefined } }
          : {}),
        ...(minSugars || maxSugars
          ? { sugars: { gte: minSugars || 0, lte: maxSugars || undefined } }
          : {}),
        ...(minSodium || maxSodium
          ? { sodium: { gte: minSodium || 0, lte: maxSodium || undefined } }
          : {}),
      },
    });
  }

  async reset() {
    return this.prisma.food.deleteMany();
  }

  async create(userId: string, data: any) {
    const dataDto = plainToInstance(createFoodDto, data);
    const validationErrors = await validate(dataDto);
    console.log('[food.service.ts] create() | data: ', JSON.stringify(dataDto));
    if (validationErrors.length > 0) {
      console.log('[food.service.ts] create() | validationErrors: ', validationErrors);
      throw new HttpException('Invalid request body for creating new food.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.food.create(
      {
        data: {
          ...data, userId: userId,
        }
      }
    );
  }
}
