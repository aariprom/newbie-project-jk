import { Module } from '@nestjs/common';
import { DietService } from './diet.service';
import { DietController } from './diet.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [DietService, PrismaService],
  controllers: [DietController]
})
export class DietModule {}
