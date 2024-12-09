import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ParseAndValidate implements PipeTransform {
  constructor(private readonly dto: Type<any>) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Device query parameter is required');
    }

    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Invalid JSON format for device parameter');
    }

    // Validate the parsed object against the provided DTO
    const object = plainToInstance(this.dto, parsedValue);
    const errors = validateSync(object);

    if (errors.length > 0) {
      // Gather validation error messages
      const messages = errors.map(err => Object.values(err.constraints || {}).join(', '));
      throw new BadRequestException(messages.join('; '));
    }

    return object; // Return the validated object
  }
}
