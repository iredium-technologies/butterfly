// import { UserService } from '~/src/services/user'
import { BaseMiddleware } from '~/src/middlewares/base_middleware'

// const User = new UserService()

export class ParseAuthUserMiddleware extends BaseMiddleware {
  public static default (): Function {
    return async (req, res, next): Promise<void> => {
      const scopesString = req.get('X-Authenticated-Scope')
      const scopes = scopesString ? scopesString.split(' ') : []
      const userId = req.get('X-Authenticated-Userid')
      let user = null
      // if (userId) user = await User.get(userId)
      if (userId) user = null
      req.user = user
      req.authInfo = { scopes }
      next()
    }
  }
}
