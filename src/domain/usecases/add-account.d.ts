export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = boolean
}

export interface AddAccount {
  add: (data: AddAccount.Params) => Promise<AddAccount.Result>
}
