import type { AddSurveyRepository } from '@/data/protocols'
import type { AddSurvey, AddSurveyParams } from '@/domain/usecases'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}
