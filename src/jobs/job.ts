import { JobInterface } from '~/src/jobs/job_interface'
import kue = require('kue')

export abstract class Job implements JobInterface {
  public abstract name: string;
  public abstract maxActiveJob: number;
  public static redisHost: '';

  public static enqueue (name, data = {}, priority = 'normal', attempts = 3): Promise<{}> {
    return new Promise((resolve, reject): void => {
      const queue = kue.createQueue({ redis: Job.redisHost })
      queue.create(name, data)
        .priority(priority)
        .attempts(attempts)
        .on('enqueue', (result): void => {
          console.log(`job ${name} is now queued with priority ${priority} and data ${JSON.stringify(data)}`)
          resolve()
        })
        .on('complete', (result): void => {
          console.log(`Job ${name} completed with data: ${result}`)
        })
        .save((err): void => {
          if (err) reject(err)
        })
    })
  }

  public abstract perform (job, done): void;
}
