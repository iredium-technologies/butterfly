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
    return this.isAuthenticated()
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

  protected isResourceOwner (): boolean {
    const user = this.user ? this.user : null
    const record = this.record
    const alwaysAllowedUserRoles = [
      'root',
      ...this.alwaysAllowedUserRoles
    ]

    // keep this above the allow non user owned resource  so that public request still be blocked
    if (!user) {
      return false
    }

    if (!record.user_id) {
      return true
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
