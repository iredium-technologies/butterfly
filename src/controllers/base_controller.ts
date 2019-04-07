import { Class } from '~/src/types/class';
import { BaseService } from '~/src/services/base_service'
import { BasePolicy } from '~/src/policies/base_policy'
import { UnauthorizedError } from '~/src/errors/unauthorized'
import { UserInterface } from '~/src/models/user/interface'
import mongoose = require('mongoose')

export class BaseController {
  protected PolicyClass
  protected user: UserInterface
  protected policy: BasePolicy
  protected service: BaseService

  public constructor (ServiceClass: Class, PolicyClass: Class) {
    this.service = new ServiceClass()
    this.PolicyClass = PolicyClass
    const User = mongoose.model('$User')
    this.user = new User() as UserInterface
    this.policy = new BasePolicy(this.user, null)
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
