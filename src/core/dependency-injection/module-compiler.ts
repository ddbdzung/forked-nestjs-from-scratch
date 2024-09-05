// import { Type } from '../interfaces/common.interface';
// import { ModuleFactory } from './dependency-injection.type';
// import { ModuleTokenFactory } from './module-token-factory';

// export class ModuleCompiler {
//   constructor(private readonly _moduleTokenFactory = new ModuleTokenFactory()) {}

//   public extractMetadata(metatype: Type<unknown>): { type: Type<unknown> } {
//     return {
//       type: metatype,
//     };
//   }

//   public compile(metatype: Type<unknown>): ModuleFactory {
//     const { type } = this.extractMetadata(metatype);
//     const token = this._moduleTokenFactory.create(type);

//     return {
//       type,
//       token,
//     };
//   }
// }
