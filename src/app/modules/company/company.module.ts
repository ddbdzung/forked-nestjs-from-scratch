import { Module } from '@/core/common/module.decorator';
import { TokenModule } from '../token/token.module';
import { CompanyService } from './company.service';

@Module({
  imports: [],
  exports: [CompanyService],
  providers: [CompanyService],
})
export class CompanyModule {}
