import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { Sex } from '@prisma/client';

export function IsSex(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSex',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(Sex).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid FoodType (${Object.values(
            Sex
          ).join(', ')})`;
        },
      },
    });
  };
}