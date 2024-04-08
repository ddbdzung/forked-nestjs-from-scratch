import dotenv from 'dotenv'
import debug from 'debug'
import { expand } from 'dotenv-expand'

import { DEBUG_CODE } from '@/core/constants/common.constant'
import { BaseEnv } from '@/core/modules/env/env.module'
import { Env } from '@/app/modules/env/env.module'

const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR)

const _preloadEnv = () => {
  let isEnvLoaded = false
  let loadedEnv = {}
  return () => {
    if (isEnvLoaded) {
      return loadedEnv
    }

    const NODE_ENV = process.env.NODE_ENV
    if (!NODE_ENV) {
      sysLogError('Environment variable NODE_ENV is required but not found.')
      process.exit(1)
    }

    const env = dotenv.config({
      path: `.env.${NODE_ENV}`,
    })
    // With dotenv-expand, we can do something like this in .env file
    // DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}
    if (env.error) {
      sysLogError('Error while loading environment variables', env.error)
      process.exit(1)
    }

    expand(env)
    if (!env.parsed) {
      sysLogError('Environment variables are not loaded')
      process.exit(1)
    }

    isEnvLoaded = true
    loadedEnv = env.parsed
    env.parsed.NODE_ENV = NODE_ENV
    return env.parsed
  }
}

export const preloadEnv = _preloadEnv()

export const bootstrapBaseEnv = () => {
  const env = preloadEnv()

  BaseEnv.init(env)
  const baseEnv = BaseEnv.getInstance()
  baseEnv.validateEnvVars()
}

export const bootstrapExtendedEnv = () => {
  const env = preloadEnv()
  Env.init(env)
  const envInstance = Env.getInstance()
  envInstance.validateEnvVars()
}
