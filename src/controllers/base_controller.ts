import { User } from '~/src/models/user/index';
import { BaseService } from '~/src/services/base_service'
import { BasePolicy } from '~/src/policies/base_policy'
import { UnauthorizedError } from '~/src/errors/unauthorized'
import { UserInterface } from '~/src/models/user/interface'

export class BaseController {
  protected PolicyClass
  protected user: UserInterface
  protected policy: BasePolicy
  protected service: BaseService

  public constructor (ServiceClass, PolicyClass) {
    if (ServiceClass) this.service = new ServiceClass()
    this.PolicyClass = PolicyClass
    this.user = new User()
    this.policy = new BasePolicy(this.user, null)
    this.service = new BaseService(User)
  }

  public authorize (method, record = null): void {
    this.policy = this.PolicyClass ? new this.PolicyClass(this.user, record) : new BasePolicy(this.user, record)
    if (!this.policy[method](record)) {
      throw new UnauthorizedError()
    }
  }

  public setUser (user): void {
    this.user = user
  }
}
