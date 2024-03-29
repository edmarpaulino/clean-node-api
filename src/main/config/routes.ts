/* eslint-disable @typescript-eslint/no-floating-promises */

import { Router, type Express } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(path.join(__dirname, '/../routes')).map(async (file) => {
    if (
      !file.includes('.test.') &&
      !file.includes('.spec.') &&
      !file.endsWith('.map')
    ) {
      ;(await import(`../routes/${file}`)).default(router)
    }
  })
}
