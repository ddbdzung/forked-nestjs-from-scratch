import { Module } from '@/core/decorators/module.decorator.v2';
import { TokenModule } from '../token/token.module';
import { CompanyService } from './company.service';

@Module({
  imports: [TokenModule],
  exports: [TokenModule],
  providers: [CompanyService],
})
export class CompanyModule {}
