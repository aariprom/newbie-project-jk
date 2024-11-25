import { Module } from '@nestjs/common';
import { XlsxService } from './xlsx.service';

@Module({
  imports: [],
  providers: [XlsxService],
  exports: [XlsxService],
})
export class XlsxModule {}
