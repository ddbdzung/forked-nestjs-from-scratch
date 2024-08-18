import 'reflect-metadata';
import { injectable, inject, Container } from 'inversify';
import { IUserRepository } from './app/modules/user/interfaces/user.repository.interface';
import { UserRepository } from './app/modules/user/user.repository';
import { USER_DI } from './app/modules/user/user.constant';

export interface Warrior {
  fight(): string;
  sneak(): string;
}

export interface Weapon {
  hit(): string;
}

export interface ThrowableWeapon {
  throw(): string;
}

const TYPES = {
  Warrior: Symbol.for('Warrior'),
  Weapon: Symbol.for('Weapon'),
  ThrowableWeapon: Symbol.for('ThrowableWeapon'),
};

@injectable()
class Katana implements Weapon {
  public hit() {
    return 'cut!';
  }
}

@injectable()
class Shuriken implements ThrowableWeapon {
  public throw() {
    return 'hit!';
  }
}

@injectable()
class Ninja implements Warrior {
  @inject(TYPES.Weapon) private _katana: Weapon;
  @inject(TYPES.ThrowableWeapon) private _shuriken: ThrowableWeapon;
  public fight() {
    return this._katana.hit();
  }
  public sneak() {
    return this._shuriken.throw();
  }
}

const myContainer = new Container();
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
myContainer.bind<IUserRepository>(USER_DI.USER_REPOSITORY).to(UserRepository);
// const ninja1 = myContainer.get<Warrior>(TYPES.Warrior);
// console.log('[DEBUG][DzungDang] ninja1:', ninja1.fight());
// console.log('[DEBUG][DzungDang] ninja1:', ninja1.sneak());
// ninja1.fight();

export { myContainer as container };
