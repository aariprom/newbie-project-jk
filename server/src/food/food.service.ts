import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createFoodDto } from './dto/createFood.dto';
import { searchFoodQueryDto } from './dto/searchFoodQueryDto';
import { FoodResDto } from './dto/foodRes.dto';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {};

  async search(searchParams: searchFoodQueryDto) {
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
      userId,
    } = searchParams;

    const whereClause: any = {};

    // Add conditions dynamically based on the input params
    if (name) {
      whereClause.name = { contains: name }; // Case-insensitive search
    }

    if (type) {
      whereClause.type = type; // Matches the exact type (enum)
    }

    if (category) {
      whereClause.category = category; // Exact category match
    }

    if (minCalories !== undefined || maxCalories !== undefined) {
      whereClause.calories = {};
      if (minCalories !== undefined) {
        whereClause.calories.gte = minCalories; // Greater than or equal to minCalories
      }
      if (maxCalories !== undefined) {
        whereClause.calories.lte = maxCalories; // Less than or equal to maxCalories
      }
    }

    if (minProtein !== undefined || maxProtein !== undefined) {
      whereClause.protein = {};
      if (minProtein !== undefined) {
        whereClause.protein.gte = minProtein; // Greater than or equal to minProtein
      }
      if (maxProtein !== undefined) {
        whereClause.protein.lte = maxProtein; // Less than or equal to maxProtein
      }
    }

    if (minCarbohydrates !== undefined || maxCarbohydrates !== undefined) {
      whereClause.carbohydrates = {};
      if (minCarbohydrates !== undefined) {
        whereClause.carbohydrates.gte = minCarbohydrates; // Greater than or equal to minCarbohydrates
      }
      if (maxCarbohydrates !== undefined) {
        whereClause.carbohydrates.lte = maxCarbohydrates; // Less than or equal to maxCarbohydrates
      }
    }

    if (minFat !== undefined || maxFat !== undefined) {
      whereClause.fat = {};
      if (minFat !== undefined) {
        whereClause.fat.gte = minFat; // Greater than or equal to minFat
      }
      if (maxFat !== undefined) {
        whereClause.fat.lte = maxFat; // Less than or equal to maxFat
      }
    }

    if (minSugars !== undefined || maxSugars !== undefined) {
      whereClause.sugars = {};
      if (minSugars !== undefined) {
        whereClause.sugars.gte = minSugars; // Greater than or equal to minSugars
      }
      if (maxSugars !== undefined) {
        whereClause.sugars.lte = maxSugars; // Less than or equal to maxSugars
      }
    }

    if (minSodium !== undefined || maxSodium !== undefined) {
      whereClause.sodium = {};
      if (minSodium !== undefined) {
        whereClause.sodium.gte = minSodium; // Greater than or equal to minSodium
      }
      if (maxSodium !== undefined) {
        whereClause.sodium.lte = maxSodium; // Less than or equal to maxSodium
      }
    }

    if (userId) {
      whereClause.userId = userId;
    }

    const foods = await this.prisma.food.findMany({
      where: whereClause,
      select: {
        id: true,
        calories: true,
        carbohydrates: true,
        protein: true,
        fat: true,
        sugars: true,
        sodium: true,
      }
    });

    return foods.map(food => new FoodResDto(food));
  }

  async reset() {
    return this.prisma.food.deleteMany();
  }

  async create(userId: string, data: createFoodDto) {
    const food = await this.prisma.food.create(
      {
        data: {
          ...data, userId: userId,
        }
      }
    );
    return new FoodResDto(food);
  }

  async delete(foodId: number): Promise<any> {
    return this.prisma.food.delete({
      where: {
        id: foodId,
      }
    })
  }

}
