import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  providers: [UserService,],
  exports: [UserService],
  controllers: [UserController],
  imports: [UploadModule],
})
export class UserModule {}
