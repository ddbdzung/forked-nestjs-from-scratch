import { ModuleUtil } from '../module-util';
import { ModuleValidator } from '../module-validator';

import { MainModule } from './fixtures/ModuleValidator/main.module';

describe('ModuleValidator', () => {
  describe('.validateImports()', () => {
    it('should throw error when importing circular dependency directly', () => {
      expect(() =>
        ModuleValidator.validateImports(ModuleUtil.getImportsForModule(MainModule), MainModule),
      ).toThrow();
    });
  });
});
