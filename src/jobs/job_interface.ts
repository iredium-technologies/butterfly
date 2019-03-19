
/**
 * Every job must be implement this interface
 */
export interface JobInterface{
  name: string;
  maxActiveJob: number;
  perform (job, done): void;
}
