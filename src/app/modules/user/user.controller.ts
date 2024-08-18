import { Controller } from '@/core/decorators/controller.decorator';
import { Inject } from '@/core/decorators/inject.decorator';
import { USER_DI } from './user.constant';
import { UserRepository } from './user.repository';
import { APIResponseBuilder } from '@/core/helpers';
import { IUserRepository } from './interfaces/user.repository.interface';
import { Container } from '@/core/container/inversify.config';

@Controller()
export class UserController {
  // constructor(
  //   @Inject(USER_DI.USER_REPOSITORY)
  //   private readonly userRepository: IUserRepository,
  // ) {}

  async getAllUsers(req, res, next) {
    // console.log('[DEBUG][DzungDang] this:', this);
    // console.log('[DEBUG][DzungDang] this.userRepository:', this.userRepository);
    // console.log(
    //   '[DEBUG][DzungDang] ContainerContainer:',
    //   Container.getInstance().get<IUserRepository>(USER_DI.USER_REPOSITORY),
    // );
    console.log('[DEBUG][DzungDang] before get in GetAllUsers:', Container.getInstance());
    const xx = Container.getInstance().get(USER_DI.USER_REPOSITORY);
    console.log('[DEBUG][DzungDang] xx:', xx);
    // const data = await this.userRepository.findAll();
    // console.log('[DEBUG][DzungDang] data:', data);
    return new APIResponseBuilder().isApiOK().build();
  }
}
