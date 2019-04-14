export abstract class Database {
  protected adapter
  public abstract connect (config: object);
  public abstract close ();
}