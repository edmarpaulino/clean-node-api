import { mockAddSurveyParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import type { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'

describe('SurveyMongoRepository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on loadAll success', async () => {
      const addSurveyParamsArray = [
        mockAddSurveyParams(),
        mockAddSurveyParams()
      ]
      await surveyCollection.insertMany(addSurveyParamsArray)
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyParamsArray[0].question)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveyParamsArray[1].question)
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load a survey on loadById success', async () => {
      const addSurveyParams = mockAddSurveyParams()
      const { insertedId } = await surveyCollection.insertOne(addSurveyParams)
      const sut = makeSut()
      const survey = await sut.loadById(insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
      expect(survey?.question).toBe(addSurveyParams.question)
    })
  })
})
