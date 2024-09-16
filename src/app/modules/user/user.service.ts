import { CONSTRUCTOR_PARAM_METADATA_KEY, Injectable } from '@/core/dependencies';
import { IUserService } from './interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  getUser(): void {
    console.log('User service: Get user!');
  }
}
