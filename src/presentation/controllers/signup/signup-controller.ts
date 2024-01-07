import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  public handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({ name, email, password })
      const accessToken = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error as Error)
    }
  }
}
