import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { FoodType } from '@prisma/client'

export function IsFoodType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFoodType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(FoodType).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid FoodType (${Object.values(
            FoodType
          ).join(', ')})`;
        },
      },
    });
  };
}