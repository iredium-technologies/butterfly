export abstract class Database {
  public abstract name: string
  public connection
  protected config
  protected adapter
  public constructor (config = {}) {
    this.config = config
    this.connect()
  }
  public abstract connect ();
  public abstract close ();
}
