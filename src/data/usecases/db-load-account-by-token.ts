import type { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import type { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Result> {
    let decryptedToken: string | null
    try {
      decryptedToken = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      )
      if (account) {
        return account
      }
    }
    return null
  }
}
