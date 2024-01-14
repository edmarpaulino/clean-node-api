/* eslint-disable @typescript-eslint/no-misused-promises */

import { adaptRoute } from '@/main/adapter/express/express-route-adapter'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-factory'
import { auth } from '@/main/middlewares/auth'
import type { Router } from 'express'

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  )
}
