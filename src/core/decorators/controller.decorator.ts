// import debug from 'debug';

// import { AbstractController, AbstractModel, SystemException } from '../helpers';
// import { DEBUG_CODE } from '../constants/common.constant';

// const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

// // const METHOD_METADATA_KEY = Symbol('method_metadata_key');

// function ControllerDecoratorFactory() {
//   return <T extends new (...args: any[]) => T>(ctor: T) => {
//     const methods = Object.getOwnPropertyNames(ctor.prototype).filter(
//       (name) => name !== 'constructor' && typeof ctor.prototype[name] === 'function',
//     );

//     // Re-define metadata for constructor
//     Reflect.defineMetadata('METHOD_METADATA_KEY', methods, ctor);

//     return ctor;
//   };
// }

// export { ControllerDecoratorFactory as Controller };
