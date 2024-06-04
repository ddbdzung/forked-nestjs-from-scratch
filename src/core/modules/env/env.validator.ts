import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, IsPort } from 'class-validator';

import { parseSafeInteger } from '@/core/utils/number.util';

@Exclude()
export class ValidatorClass {
  static isValidated = false;

  @Expose()
  @IsString()
  DATABASE_NAME: string;

  @Expose()
  @IsString()
  DATABASE_HOST: string;

  @Expose()
  @Transform((params) => {
    if (!ValidatorClass.isValidated) {
      return params.value;
    }

    return parseSafeInteger(params.value);
  })
  @IsPort()
  DATABASE_PORT: number;

  @Expose()
  @IsString()
  DATABASE_USERNAME: string;

  @Expose()
  @IsString()
  DATABASE_PASSWORD: string;

  @Expose()
  @IsOptional()
  DEBUG: string;
}
