import { BasePolicy } from '~/src/policies/base_policy'

export class Level1Policy extends BasePolicy {
  public index (): boolean {
    return true
  }

  public show (): boolean {
    return true
  }

  public create (): boolean {
    return this.allowedUser()
  }

  public update (): boolean {
    return this.allowedUser()
  }

  public destroy (): boolean {
    return this.allowedUser()
  }

  public restore (): boolean {
    return this.allowedUser()
  }

  public allowedUser (): boolean {
    return this.user && this.user.admin()
  }
}
