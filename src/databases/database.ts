export abstract class Database {
  public abstract name: string
  public connection
  protected adapter
  public abstract connect (config: object);
  public abstract close ();
}
