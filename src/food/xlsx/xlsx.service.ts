import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service'
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { foodCreateDto } from '../dto/foodCreate.dto';

@Injectable()
export class XlsxService {
  constructor(private readonly prisma: PrismaService) {}

  async readExcelFile(filePath: string)  {
    try {
      // Read the file
      const fileBuffer = await fs.readFile(filePath);

      // Parse the Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

      // Assume we want to read the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      return XLSX.utils.sheet_to_json<Prisma.FoodCreateManyInput>(worksheet);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      throw error;
    }
  }

  async readTest() {
    return await this.readExcelFile('./others/xlsx/test.xlsx');
  }

  async getTest() {
    return this.prisma.food.findMany();
  }

  async syncTest() {
    const jsonArray = await this.readTest();
    console.log(jsonArray);
    return this.prisma.food.createMany({
      data: jsonArray,
    })
  }

  async init() {
    console.log('[xlsx.service.ts] init()')
    console.log('[xlsx.service.ts] Reading...')
    const file = await this.readExcelFile('./others/xlsx/food.xlsx');
    console.log('[xlsx.service.ts] Reading complete!')
    const batchSize = 100;
    return this.prisma.$transaction(async (prisma) => {
      for (let i = 0; i < file.length; i += batchSize) {
        const batch = file.slice(i, i + batchSize);
        console.log('[xlsx.service.ts] Initializing Food DB... ('+i+'/'+file.length+')');

        let temp = i;
        for (const item of batch) {
          const itemDto = plainToInstance(foodCreateDto, item);
          console.log('[xlsx.service.ts] Validating Food items... ('+temp+'/'+file.length+')');
          const validationErrors = await validate(itemDto, { whitelist: false, stopAtFirstError: true});
          temp++;

          if (validationErrors.length > 0) {
            console.log('[xlsx.service.ts] Validation error occurred: ', validationErrors);
            throw new Error('validation error');
          }
        }

        await prisma.food.createMany({ data: batch });
      }
    }, { timeout: 100000 });
  }

  async reset() {
    return this.prisma.food.deleteMany();
  }

  async search(searchParams: {
    name?: string,
    type?: number,
    category?: number,
    calories?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    sugars?: number,
    sodium?: number,
}) {
    const { name, type, category, protein, calories, carbohydrates, fat, sugars, sodium } = searchParams;

    return this.prisma.food.findMany({
      where: {
        ...(name && { name }),
        ...(type && { type }),
        ...(category && { category }),
        ...(calories && { calories: { lte: calories } }),
        ...(protein && { protein: { lte: protein } }),
        ...(carbohydrates && { carbohydrates: { lte: carbohydrates } }),
        ...(fat && { fat: { lte: fat } }),
        ...(sugars && { sugars: { lte: sugars } }),
        ...(sodium && { sodium: { lte: sodium } }),
      },
      /* todo: orderBy implement */
    });
  }
}
