import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { DietType } from '@prisma/client'

export function IsDietType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDietType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(DietType).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid FoodType (${Object.values(
            DietType
          ).join(', ')})`;
        },
      },
    });
  };
}