import type { AccountModel, AuthenticationModel } from '@/domain/models'
import type {
  AddAccount,
  AddAccountParams,
  Authentication,
  AuthenticationParams,
  LoadAccountByToken
} from '@/domain/usecases'
import { mockAccountModel, mockAuthenticationModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  private readonly defaultAccountModel: AccountModel = mockAccountModel()

  public addAccountParams: AddAccountParams
  public accountModel: AccountModel | null = this.defaultAccountModel

  async add(data: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = data
    return await Promise.resolve(this.accountModel)
  }

  reset(): void {
    this.accountModel = this.defaultAccountModel
  }
}

export class AuthenticationSpy implements Authentication {
  private readonly defaultAuthenticationModel: AuthenticationModel =
    mockAuthenticationModel()

  public authenticationParams: AuthenticationParams
  public authenticationModel: AuthenticationModel | null =
    this.defaultAuthenticationModel

  async auth(data: AuthenticationParams): Promise<AuthenticationModel | null> {
    this.authenticationParams = data
    return await Promise.resolve(this.authenticationModel)
  }

  reset(): void {
    this.authenticationModel = this.defaultAuthenticationModel
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  private readonly defaultAccountModel: AccountModel = mockAccountModel()

  public accessToken: string
  public role?: string
  public accountModel: AccountModel | null = this.defaultAccountModel

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.accountModel)
  }

  reset(): void {
    this.accountModel = this.defaultAccountModel
  }
}