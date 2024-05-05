import { Exclude, Expose, Transform } from 'class-transformer';
import { IsIP, IsNumber, IsOptional, IsPort, IsString } from 'class-validator';

import { parseSafeInteger } from '@/core/utils/number.util';

@Exclude()
export class ValidatorClass {
  static isValidated = false;

  @Expose()
  NODE_ENV: string;

  @Expose()
  @IsString()
  APP_SERVICE_NAME: string;

  @Expose()
  @IsIP()
  APP_HOST: string;

  @Expose()
  @Transform((params) => {
    if (!ValidatorClass.isValidated) {
      return params.value;
    }

    return parseSafeInteger(params.value);
  })
  @IsPort()
  APP_PORT: number;
}
