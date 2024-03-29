import type { AccountModel, SurveyModel } from '@/domain/models'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import MockDate from 'mockdate'
import type { Collection } from 'mongodb'

describe('SurveyMongoRepository', () => {
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

  const makeSurvey = async (): Promise<SurveyModel> => {
    const { insertedId } = await surveyCollection.insertOne(
      mockAddSurveyParams()
    )
    const survey = await surveyCollection.findOne({ _id: insertedId })
    return survey && MongoHelper.map(survey)
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const { insertedId } = await accountCollection.insertOne(
      mockAddAccountParams()
    )
    const account = await accountCollection.findOne({ _id: insertedId })
    return account && MongoHelper.map(account)
  }

  describe('save()', () => {
    test('Should add a survey result if its new ', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: MongoHelper.generateObjectId(survey.id),
        accountId: MongoHelper.generateObjectId(account.id)
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey.id)
      expect(surveyResult?.accountId.toString()).toBe(account.id)
      expect(surveyResult?.answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.date).toEqual(new Date())
    })

    test('Should update survey result if its not new ', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: MongoHelper.generateObjectId(survey.id),
        accountId: MongoHelper.generateObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResults = await surveyResultCollection
        .find({
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account.id)
        })
        .toArray()
      expect(surveyResults).toBeTruthy()
      expect(surveyResults).toHaveLength(1)
      const [surveyResult] = surveyResults
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey.id)
      expect(surveyResult?.accountId.toString()).toBe(account.id)
      expect(surveyResult?.answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.date).toEqual(new Date())
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result - 1', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account1 = await makeAccount()
      const account2 = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account1.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account2.id),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])
      const surveyResult = await sut.loadBySurveyId(
        survey.id.toString(),
        account1.id.toString()
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey.id.toString())
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(100)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[1].count).toBe(0)
      expect(surveyResult?.answers[1].percent).toBe(0)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result - 2', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account1 = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account1.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account2.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account3.id),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])
      const surveyResult = await sut.loadBySurveyId(
        survey.id.toString(),
        account1.id.toString()
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey.id.toString())
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(67)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(33)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result - 3', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account1 = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account1.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: MongoHelper.generateObjectId(survey.id),
          accountId: MongoHelper.generateObjectId(account2.id),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])
      const surveyResult = await sut.loadBySurveyId(
        survey.id.toString(),
        account3.id.toString()
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey.id.toString())
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(100)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[1].count).toBe(0)
      expect(surveyResult?.answers[1].percent).toBe(0)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(
        survey.id.toString(),
        account.id.toString()
      )
      expect(surveyResult).toBeNull()
    })
  })
})
