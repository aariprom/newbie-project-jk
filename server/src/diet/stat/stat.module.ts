import { StatService } from './stat.service';
import { Module } from '@nestjs/common';
import { DailyConsumeService } from '../dailyConsume.service';

@Module({
  providers: [StatService, DailyConsumeService],
  exports: [StatService,],
})

export class StatModule {}