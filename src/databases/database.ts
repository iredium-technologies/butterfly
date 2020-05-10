export abstract class Database {
  public abstract name: string
  public connection
  protected config
  protected debug
  protected adapter
  public constructor (config = {}, debug = false) {
    this.config = config
    this.debug = debug
    this.connect()
  }
  public abstract connect ();
  public abstract close ();
}
