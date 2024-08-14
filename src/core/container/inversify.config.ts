import 'reflect-metadata';
import { Container } from 'inversify';
import { UserRepository } from '@/app/modules/user/user.repository'; // Adjust path as necessary
import { USER_DI } from '@/app/modules/user/user.constant';

const container = new Container();

// Bind your services
container.bind<UserRepository>(USER_DI.USER_REPOSITORY).to(new UserRepository());

export { container };
