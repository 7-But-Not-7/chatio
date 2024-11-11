// src/auth/decorators/is-either.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEither(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEither',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value != null || relatedValue != null;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `Either ${args.property} or ${relatedPropertyName} must be provided`;
        },
      },
    });
  };
}