import { Exclude, Expose } from 'class-transformer'
import { IsString } from 'class-validator'

@Exclude()
export class ValidatorClass {
  static isValidated = false

  @Expose()
  @IsString()
  DATABASE_NAME: string
}
