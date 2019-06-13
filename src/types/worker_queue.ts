export interface WorkerQueue {
  process(name: string, maxActiveJob: number, perform: Function);
}
