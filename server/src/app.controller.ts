import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/echo/:str')
  @Public()
  echo(@Param('str') str: string): string {
    return this.appService.echo(str);
  }
}
