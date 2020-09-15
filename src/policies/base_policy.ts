export class BasePolicy {
  protected user
  protected record

  public constructor (user, record) {
    this.user = user
    this.record = record
  }

  public index (): boolean {
    return false
  }

  public show (): boolean {
    return false
  }

  public create (): boolean {
    return false
  }

  public update (): boolean {
    return false
  }

  public destroy (): boolean {
    return false
  }

  public restore (): boolean {
    return false
  }

  public allowedUser (): boolean {
    return false
  }

  protected isAuthenticated (): boolean {
    return !!this.user
  }
}
