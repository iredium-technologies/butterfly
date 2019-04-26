import { UserService } from '~/src/services/user'
import { ApiController } from '~/src/controllers/api_controller'
import { UserPolicy } from '~/src/policies/user'
import { BaseResponse } from '~/src/routes/responses/base_response'
import { JsonResponse } from '~/src/routes/responses/json'
import { UnauthorizedError } from '~/src/errors';

export class UsersController extends ApiController {
  public constructor () {
    super(UserService, UserPolicy)
  }

  public async me (req): Promise<BaseResponse> {
    throw new UnauthorizedError('hahahah')
    return new JsonResponse(this.user)
  }
}
