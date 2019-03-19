import { Job } from '~/src/jobs/job'

export class SampleJob extends Job {
  public name: string = 'iredium.jobs.sample-job'
  public maxActiveJob: number = 3

  public perform (job, done): void {
    let currentProgress = 0
    console.log('start job')
    const totalTime = 100 * Math.floor(Math.random() * 60)
    const updateProgressInterval = setInterval((): void => {
      currentProgress += 100
      job.progress(currentProgress, totalTime)
    }, 1000)
    setTimeout((): void => {
      console.log(`Test job complete. Here is the message from the job: ${JSON.stringify(job.data)}`)
      clearInterval(updateProgressInterval)
      done()
    }, totalTime)
  }
}
