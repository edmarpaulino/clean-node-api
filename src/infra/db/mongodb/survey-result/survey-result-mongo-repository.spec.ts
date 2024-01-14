import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import MockDate from 'mockdate'
import type { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany()
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany()
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany()
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  const makeSurvey = async (): Promise<string> => {
    const { insertedId } = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ]
    })
    return insertedId.toString()
  }

  const makeAccount = async (): Promise<string> => {
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
    return insertedId.toString()
  }

  describe('save()', () => {
    test('Should add a survey result if its new ', async () => {
      const sut = makeSut()
      const surveyId = await makeSurvey()
      const accountId = await makeAccount()
      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe('any_answer')
    })
  })
})