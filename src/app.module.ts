import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DietModule } from './diet/diet.module';

@Module({
  imports: [DietModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
