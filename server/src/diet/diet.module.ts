import { Module } from '@nestjs/common';
import { DietService } from './diet.service';
import { DietController } from './diet.controller';
import { PrismaService } from '../prisma.service';
import { DailyConsumeService } from './dailyConsume.service';
import { UsersService } from '../users/users.service';
import { S3Service } from '../S3/s3.service';

@Module({
  providers: [DietService, DailyConsumeService, PrismaService, UsersService, S3Service,],
  controllers: [DietController],
  exports: [DietService],
})
export class DietModule {}
