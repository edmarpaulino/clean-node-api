import type { Validation } from '@/presentation/protocols'
import type { EmailValidator } from '@/validation/protocols/email-validator'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
