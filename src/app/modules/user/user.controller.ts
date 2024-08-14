import { Controller } from '@/core/decorators/controller.decorator';
import { AbstractController } from '@/core/helpers';
import { Inject } from '@/core/decorators/inject.decorator';
import { USER_DI } from './user.constant';
import { UserRepository } from './user.repository';

@Controller()
export class UserController extends AbstractController {
  constructor(@Inject(USER_DI.USER_REPOSITORY) private readonly userRepository: UserRepository) {
    super();
  }
}
