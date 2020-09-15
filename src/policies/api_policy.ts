import { BasePolicy } from '~/src/policies/base_policy'

export class ApiPolicy extends BasePolicy {
  protected alwaysAllowedUserRoles: string[] = []

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
    return this.isResourceOwner()
  }

  public isResourceOwner (): boolean {
    const user = this.user ? this.user : null
    const record = this.record
    const alwaysAllowedUserRoles = [
      'root',
      ...this.alwaysAllowedUserRoles
    ]

    if (!user) {
      return false
    }

    if (user.role) {
      const roles = user.role.split ? user.role.split(' ') : []
      for (let role of roles) {
        if (alwaysAllowedUserRoles.includes(role)) {
          return true
        }
      }
    }

    return user.id === record.user_id
  }
}
