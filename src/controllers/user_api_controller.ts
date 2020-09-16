import { ApiController } from "./api_controller";

export class UserApiController extends ApiController {
  protected getDefaultIndexQuery (): object {
    return {
      user_id: this.user.id
    }
  }
}
