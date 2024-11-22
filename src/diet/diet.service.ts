import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateDietDto } from './dto/createDiet.dto';
import { validate } from 'class-validator';
import { PrismaService } from '../prisma.service';
import { EditDietDto } from './dto/editDiet.dto';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiet(userId: string, data: any) {
    const validated = plainToInstance(CreateDietDto, data);
    const validationError = await validate(validated);
    if (validationError.length > 0) {
      console.log('[post.service] createDiet | validationError: ', validationError);
      throw new HttpException('Invalid request body to create a new diet.', HttpStatus.BAD_REQUEST);
    }
    const diet = await this.prisma.diet.create({
      data: {
        date: validated.date,
        type: validated.type,
        memo: validated.memo,
        user: {
          connect: {
            id: userId,
          }
        }
      }
    });
    return this.registerFoodIntoDiet(diet.id, validated.foods);
  }

  async registerFoodIntoDiet(dietId: number, foods: number[]) {
    return this.prisma.$transaction(async (prisma) => {
      for (const foodId of foods) {
        await prisma.foodsInDiet.create({
          data: {
            food: {
              connect: { id: foodId, },
            },
            diet: {
              connect: { id: dietId, }
            }
          },
        });
      }
    });
  }

  async deleteDiet(dietId: number) {
    return this.prisma.diet.deleteMany({
      where: {
        id: dietId,
      }
    });
  }

  async editDiet(data: any, dietId: number) {
    const validated = plainToInstance(EditDietDto, data);
    const validationError = await validate(validated);
    if (validationError.length > 0) {
      console.log('[post.service] createDiet | validationError: ', validationError);
      throw new HttpException('Invalid request body to create a new diet.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.diet.updateMany({
      where: {
        id: dietId,
      },
      data: data,
    })
  };


}
