import type {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import type { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(data: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      data.email
    )
    if (account) {
      const isValid = await this.hashComparer.compare(
        data.password,
        account.password
      )
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        )
        return { accessToken, name: account.name }
      }
    }
    return null
  }
}
