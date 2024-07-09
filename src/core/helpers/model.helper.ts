import type { Express, Router as RouterType } from 'express';
import type { Model } from 'mongoose';

import { Router } from 'express';

import { IContextAPI, IModelHandler } from '@/core/interfaces/common.interface';

import { ControllerAPI, bindContextApi, controllerWrapper } from './controller.helper';
import { ServerFactory } from './bootstrap.helper';

export const modelHandler =
  (payload: IModelHandler) =>
  (app: Express): RouterType => {
    const { model, moduleName } = payload;
    const modelName = model.name;

    const { model: Model, repository: repositoryInstance, schema } = model.startModel();
    if (repositoryInstance) {
      ServerFactory.repositoryRegistry[moduleName].instance = repositoryInstance;
    }

    ServerFactory.schemaRegistry[modelName] = schema;
    ServerFactory.modelRegistry[moduleName] = Model;

    const ctx: IContextAPI | null = modelName ? { modelName } : null;

    const router = Router();
    const controllerAPI = ControllerAPI.getInstance();

    // Ping
    router.get('/ping', controllerWrapper(controllerAPI.ping));

    if (ctx) {
      // Get list
      router.get('/', bindContextApi(ctx), controllerWrapper(controllerAPI.getList));
    }

    return router;
  };
