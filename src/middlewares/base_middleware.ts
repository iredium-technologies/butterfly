export class BaseMiddleware {
  public static default (): Function {
    return (req, res, next): void => {
      next()
    }
  }
}
