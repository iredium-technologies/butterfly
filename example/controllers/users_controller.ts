import { UserService } from '~/src/services/user'
import { ApiController } from '~/src/controllers/api_controller'
import { UserPolicy } from '~/src/policies/user'

export class UsersController extends ApiController {
  public constructor () {
    super(UserService, UserPolicy)
  }
}
