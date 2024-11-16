import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';

@Injectable()
export class FoodService {
  constructor(private readonly prismaService: PrismaService,
              private readonly configService: ConfigService) {};

}
