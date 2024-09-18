import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import type { Server } from 'http';

import { systemErrorHandler } from '@/core/helpers';

import { ApplicationFactory } from './core/application-factory';
import { MainModule } from '@/app/main.module';

const server: Server | null = null;
systemErrorHandler(server);

async function bootstrap() {
  ApplicationFactory.create(MainModule);
}

bootstrap();
