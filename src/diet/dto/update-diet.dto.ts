import { PartialType } from '@nestjs/mapped-types';
import { CreateDietDto } from './create-diet.dto';

export class UpdateDietDto extends PartialType(CreateDietDto) {}
