import { BasePolicy } from '~/src/policies/base_policy'

export class ApiPolicy extends BasePolicy {
  public index (): boolean {
    return true
  }

  public show (): boolean {
    return true
  }

  public create (): boolean {
    return !!this.user
  }

  public update (): boolean {
    return this.isResourceOwner()
  }

  public destroy (): boolean {
    return this.isResourceOwner()
  }

  public restore (): boolean {
    return true
  }

  public isResourceOwner (): boolean {
    const user = this.user ? this.user : null
    const record = this.record

    if (!user) {
      return false
    }

    return user.id === record.user_id
  }
}
