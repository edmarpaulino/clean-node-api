import { adaptResolver } from '@/main/adapters'
import {
  makeLoginController,
  makeSignUpController
} from '@/main/factories/controllers'

export default {
  Query: {
    login: async (parent: any, args: any): Promise<any> =>
      await adaptResolver(makeLoginController(), args)
  },
  Mutation: {
    signUp: async (parent: any, args: any) =>
      await adaptResolver(makeSignUpController(), args)
  }
}