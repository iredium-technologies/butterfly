import { ApiPolicy } from '~/src/policies/api_policy'

export class UserPolicy extends ApiPolicy {
  public me (): boolean {
    return !!this.user
  }

  public index (): boolean {
    return true
  }

  public authenticate (): boolean {
    return true
  }

  public jobs (): boolean {
    return this.allowedUser()
  }

  public setAsAdmin (): boolean {
    return this.user.root()
  }

  public changePassword (): boolean {
    return this.allowedUser()
  }

  public createBySocial (): boolean {
    return true
  }

  public allowedUser (): boolean {
    return this.user && ((String(this.user.uuid) === String(this.record.uuid)) || this.user.admin())
  }
}
