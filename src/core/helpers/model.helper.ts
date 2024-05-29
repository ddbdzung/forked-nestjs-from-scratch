import type { Express } from 'express';

import { Router } from 'express';

import { IModelHandler } from '@/core/interfaces/common.interface';

import { Env } from '@/app/modules/env/env.service';

export const modelHandler = (payload: IModelHandler) => (app: Express) => {
  const { model } = payload;

  const router = Router();

  router.get('/ping', (req, res) => {
    res.status(200).json({ msg: `pong from ${Env.getInstance().get('APP_SERVICE_NAME')}!` });
  });

  return router;
};
