import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  providers: [UserService,],
  exports: [UserService],
  controllers: [UsersController],
  imports: [UploadModule],
})
export class UsersModule {}
