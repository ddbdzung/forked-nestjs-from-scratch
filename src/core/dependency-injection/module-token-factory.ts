// import { createHash } from 'crypto';
// import { Type } from '../interfaces/common.interface';
// import { Logger } from '../modules/logger-v2/logger.module';
// import { generateRandomString } from './dependency-injection.util';
// import { ILogger } from '../modules/logger-v2/logger.interface';

// export class ModuleTokenFactory {
//   // Used to cache the module tokens if the module is already registered
//   private readonly _moduleTokensCache = new Map<string, string>();

//   // Used to cache the module ids if the module is already
//   private readonly _moduleIdsCache = new WeakMap<Type<unknown>, string>(); // Use WeakMap to avoid memory leaks

//   private _hashString(value: string): string {
//     return createHash('sha256').update(value).digest('hex');
//   }

//   public constructor(
//     private readonly _logger: ILogger = new Logger(ModuleTokenFactory.name, {
//       timestamp: true,
//     }),
//   ) {}

//   public getModuleName(metatype: Type<unknown>): string {
//     return metatype.name;
//   }

//   public getModuleId(metatype: Type<unknown>): string {
//     if (this._moduleIdsCache.has(metatype)) {
//       return this._moduleIdsCache.get(metatype) as string;
//     }

//     const moduleId = generateRandomString();
//     this._moduleIdsCache.set(metatype, moduleId);

//     return moduleId;
//   }

//   public getStaticModuleToken(moduleId: string, moduleName: string): string {
//     const key = `${moduleId}_${moduleName}`;
//     if (this._moduleTokensCache.has(key)) {
//       return this._moduleTokensCache.get(key) as string;
//     }

//     const hash = this._hashString(key);
//     this._moduleTokensCache.set(key, hash);

//     return hash;
//   }

//   public create(metatype: Type<unknown>): string {
//     const moduleId = this.getModuleId(metatype);

//     return this.getStaticModuleToken(moduleId, this.getModuleName(metatype));
//   }
// }
