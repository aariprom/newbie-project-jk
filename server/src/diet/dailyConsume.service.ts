import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DailyConsumeService {
  constructor(private readonly prisma: PrismaService) {};

  async userData(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        sex: true,
        age: true,
        height: true,
        weight: true,
        level: true,
      }
    });
  };

  async refStat(userId: string) {
    const data = await this.userData(userId);
    const cal = data.sex === 'M' ?
      (10 * data.weight + 6.25 * data.height - 5 * data.age + 5) * data.level :
      (10 * data.weight + 6.25 * data.height - 5 * data.age - 161) * data.level;
    const carbohydrates = [0.45*cal/4, 0.65*cal/4];
    const protein = [0.1*cal/9, 0.35*cal/9];
    const fat = [0.2*cal/4, 0.35*cal/4];
    const sodium = 2.4;
    const sugars = 50;
    return { cal: cal, carbohydrates: carbohydrates, protein: protein, fat: fat, sodium: sodium, sugars: sugars };
  };
}