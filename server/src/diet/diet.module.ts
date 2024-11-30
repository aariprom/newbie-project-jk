import { Module } from '@nestjs/common';
import { DietService } from './diet.service';
import { DietController } from './diet.controller';
import { DailyConsumeService } from './dailyConsume.service';
import { UserService } from '../user/user.service';
import { StatModule } from './stat/stat.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [StatModule, UploadModule],
  providers: [DietService, DailyConsumeService, UserService,],
  controllers: [DietController],
  exports: [DietService],
})
export class DietModule {}
