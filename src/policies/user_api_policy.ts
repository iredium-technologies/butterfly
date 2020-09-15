import { ApiPolicy } from "./api_policy";

export class UserApiPolicy extends ApiPolicy {
  public index (): boolean {
    return this.isAuthenticated()
  }

  public show (): boolean {
    return this.isResourceOwner()
  }
}
