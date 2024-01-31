import type { SurveyModel } from '@/domain/models'
import type {
  AddSurvey,
  AddSurveyParams,
  LoadSurveyById,
  LoadSurveys
} from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModelArray } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  private readonly defaultCallsCount: number = 0

  public callsCount: number = this.defaultCallsCount
  public addSurveyParams: AddSurveyParams

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
  }

  reset(): void {
    this.callsCount = this.defaultCallsCount
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  private readonly defaultSurveyModel: SurveyModel = mockSurveyModel()

  public id: string
  public surveyModel: SurveyModel | null = this.defaultSurveyModel

  async loadById(id: string): Promise<SurveyModel | null> {
    this.id = id
    return await Promise.resolve(this.surveyModel)
  }

  reset(): void {
    this.surveyModel = this.defaultSurveyModel
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  private readonly defaultSurveyModelArray: SurveyModel[] =
    mockSurveyModelArray()

  public accountId: string
  public surveyModelArray: SurveyModel[] = this.defaultSurveyModelArray

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return await Promise.resolve(this.surveyModelArray)
  }

  reset(): void {
    this.surveyModelArray = this.defaultSurveyModelArray
  }
}