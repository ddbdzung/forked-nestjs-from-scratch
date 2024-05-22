import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class ValidatorClass {
  static isValidated = false;

  @Expose()
  @IsString()
  DATABASE_NAME: string;

  @Expose()
  @IsString()
  MONGODB_URI: string;

  @Expose()
  @IsOptional()
  DEBUG: string;
}
