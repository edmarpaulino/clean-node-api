import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'
import { DbLoadAccountByToken } from './db-load-account-by-token'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  )
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  let token: string
  let role: string

  beforeEach(() => {
    const { decrypterSpy, loadAccountByTokenRepositorySpy } = makeSut()
    decrypterSpy.reset()
    loadAccountByTokenRepositorySpy.reset()
    token = faker.string.uuid()
    role = faker.word.adjective()
  })

  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load(token, role)
    expect(decrypterSpy.ciphertext).toBe(token)
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  // test('Should call LoadAccountByTokenRepository with correct values', async () => {
  //   const { sut, loadAccountByTokenRepositorySpy } = makeSut()
  //   const loadByToken = jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
  //   await sut.load(token, role)
  //   expect(loadByToken).toHaveBeenCalledWith('any_value', 'any_role')
  // })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.accountModel = null
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.load(token, role)
    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel)
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })
})
