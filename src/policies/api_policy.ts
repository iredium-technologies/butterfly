import { BasePolicy } from '~/src/policies/base_policy'

export class ApiPolicy extends BasePolicy {
  public index (): boolean {
    return true
  }

  public show (): boolean {
    return true
  }

  public create (): boolean {
    return true
  }

  public update (): boolean {
    return this.allowedUser()
  }

  public destroy (): boolean {
    return this.allowedUser()
  }

  public restore (): boolean {
    return this.user.admin()
  }

  public allowedUser (): boolean {
    try {
      return this.user && ((String(this.user.uuid) === String(this.record.user.uuid ? this.record.user.uuid : this.record.user)) || this.user.admin())
    } catch (e) {
      return false
    }
  }
}
