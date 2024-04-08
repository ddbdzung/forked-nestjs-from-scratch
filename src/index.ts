import 'source-map-support/register'
import 'module-alias/register'
import 'reflect-metadata'

import debug from 'debug'
import express from 'express'

import { bootstrapBaseEnv, bootstrapExtendedEnv } from '@/core/helpers/bootstrap.helper'
import { Env } from '@/app/modules/env/env.module'

const sysLogError = debug('app:sys:error')
bootstrapBaseEnv()
bootstrapExtendedEnv()

const app = express()
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/health-check', (req, res) => {
  res.send('CORE: OK')
})
const env = Env.getInstance()
console.log('[DEBUG][DzungDang] env:', env.envVars)
const server = app.listen(env.get('PORT'), () => {
  console.log(`Example app listening at http://${env.get('HOST')}:${env.get('PORT')}`)
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      sysLogError('Server closed')
      process.exit(1)
    })
  } else {
    sysLogError('Server closed')
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: Error) => {
  sysLogError(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  sysLogError('SIGTERM received')
  if (server) {
    server.close()
  }
})
