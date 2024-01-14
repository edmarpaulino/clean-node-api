import type { SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import type { SurveyResultModel } from '@/domain/models/survey-result'
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(
    surveyResultData: SaveSurveyResultParams
  ): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: surveyResultData.surveyId,
        accountId: surveyResultData.accountId
      },
      {
        $set: {
          answer: surveyResultData.answer,
          date: surveyResultData.date
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return surveyResult && MongoHelper.map(surveyResult)
  }
}
