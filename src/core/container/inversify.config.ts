import 'reflect-metadata';
// import { Container } from 'inversify';
// import { UserRepository } from '@/app/modules/user/user.repository'; // Adjust path as necessary
// import { USER_DI } from '@/app/modules/user/user.constant';
// import { IUserRepository } from '@/app/modules/user/interfaces/user.repository.interface';

// const container = new Container();
// container.bind<IUserRepository>(USER_DI.USER_REPOSITORY).to(UserRepository);

// export { container };

export class Container {
  private static instance: Container;
  private currentToken: symbol | null = null;

  private containerDictionary = new Map<symbol, any>();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }

    return Container.instance;
  }

  public bind<T>(token: symbol) {
    this.containerDictionary.set(token, null);
    this.currentToken = token;

    return Container.instance;
  }

  public toInstance(target: any): void {
    if (!this.currentToken) {
      throw new Error('Token is not set');
    }

    this.containerDictionary.set(this.currentToken, target);
    this.currentToken = null;
    return;
  }

  public get<T>(token: symbol): T {
    const instance = this.containerDictionary.get(token);
    if (!instance) {
      throw new Error('Instance not set');
    }

    return instance;
  }
}
