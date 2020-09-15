import { ApiPolicy } from "./api_policy";

export class UserApiPolicy extends ApiPolicy {
  public show (): boolean {
    return this.isResourceOwner()
  }
}
