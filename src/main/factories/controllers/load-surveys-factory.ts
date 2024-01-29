import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveys } from '@/main/factories/usecases'
import { LoadSurveysController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
