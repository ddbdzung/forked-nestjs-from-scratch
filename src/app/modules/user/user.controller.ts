// import { Controller } from '@/core/decorators/controller.decorator';
// import { Inject } from '@/core/decorators/inject.decorator';
// import { USER_DI } from './user.constant';
// import { UserRepository } from './user.repository';
// import { APIResponseBuilder } from '@/core/helpers';
// import { IUserRepository } from './interfaces/user.repository.interface';
// import { container } from '../../../test';

// @Controller()
// @injectable()
// export class UserController {
//   // constructor(
//   //   @inject(USER_DI.USER_REPOSITORY)
//   //   private readonly userRepository: IUserRepository,
//   // ) {
//   //   this._userRepository = userRepository;
//   // }

//   // private _userRepository: IUserRepository;

//   async getAllUsers(req, res, next) {
//     const repository = container.get<IUserRepository>(USER_DI.USER_REPOSITORY);
//     console.log('[DEBUG][DzungDang] repository:', repository);

//     // const data = await this.userRepository.findAll();
//     // console.log('[DEBUG][DzungDang] data:', data);
//     return new APIResponseBuilder().isApiOK().build();
//   }
// }
