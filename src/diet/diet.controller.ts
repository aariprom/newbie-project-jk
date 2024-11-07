import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DietService } from './diet.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Post()
  create(@Body() createDietDto: CreateDietDto) {
    return this.dietService.create(createDietDto);
  }

  @Get()
  findAll() {
    return this.dietService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dietService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
    return this.dietService.update(+id, updateDietDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dietService.remove(+id);
  }
}
