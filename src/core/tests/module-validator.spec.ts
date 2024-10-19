import { ModuleUtil } from '../module-util';
import { ModuleValidator } from '../module-validator';

import { MainModule as CircularModule } from './fixtures/ModuleValidator/circular-deps/main.module';
import { MainModule as ImportItselfModule } from './fixtures/ModuleValidator/import-itself/main.module';
import { MainModule as ValidModule } from './fixtures/ModuleValidator/valid-case/main.module';

describe('ModuleValidator', () => {
  describe('.validateImports()', () => {
    it('should throw error when importing circular dependency directly', () => {
      const regex = /^Cannot import undefined module, possibly a circular dependency in/;
      expect(() =>
        ModuleValidator.validateImports(
          ModuleUtil.getImportsForModule(CircularModule),
          CircularModule,
        ),
      ).toThrow(regex);
    });

    it('should throw error when importing module itself', () => {
      const regex = /^Cannot import module itself/;
      expect(() =>
        ModuleValidator.validateImports(
          ModuleUtil.getImportsForModule(ImportItselfModule),
          ImportItselfModule,
        ),
      ).toThrow(regex);
    });

    it('should set imports for entry module', () => {
      ModuleValidator.validateImports(ModuleUtil.getImportsForModule(ValidModule), ValidModule);

      const imports = ModuleUtil.getImportsForModule(ValidModule);

      expect(ModuleUtil.getImportsForModule(ValidModule)).toEqual(imports);
    });
  });
});
