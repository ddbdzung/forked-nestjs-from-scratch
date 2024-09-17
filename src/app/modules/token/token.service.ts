import { Inject, Injectable } from '@/core/dependencies';
import { IUserService } from '../user/interfaces/user.service.interface';
import { TokenServiceInterface } from './interfaces/token.service.interface';
import { UserService } from '../user/user.service';
import { TimelapseServiceInterface } from '../timelapse/interfaces/timelapse.service.interface';

@Injectable()
export class TokenService implements TokenServiceInterface {
  constructor(
    @Inject('UserServiceInterface') private readonly userService: IUserService,
    @Inject('TimelapseServiceInterface')
    private readonly timelapseService: TimelapseServiceInterface,
  ) {}

  getToken(): void {
    console.log('Token service: Get token!');
    console.log('[DEBUG][DzungDang] xxx:', this.userService);
    this.userService.getUser();
    this.timelapseService.getTimelapse();
  }
}
