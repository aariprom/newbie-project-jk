import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service'

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

  async readExcel() {
    const file1 = await this.readExcelFile('../tools/xlsx/type1.xlsx');
    const file2 = await this.readExcelFile('../tools/xlsx/type1.xlsx');
    const file3 = await this.readExcelFile('../tools/xlsx/type3.xlsx');
    return [file1, file2, file3];
  }

  async readTest() {
    return await this.readExcelFile('./others/xlsx/test.xls');
  }

  async getTest() {
    return this.prisma.food.findMany();
  }

  async init() {
    const arr = this.readExcel();
  }
}