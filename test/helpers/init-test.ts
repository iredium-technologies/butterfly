import Butterfly from '~/src/butterfly';
import config from '~/example/config'

export function initTest (): Butterfly {
  const butterfly = new Butterfly(config)

  beforeAll(async (): Promise<void> => {
    await butterfly.boot()
  })

  afterAll(async (): Promise<void> => {
    await butterfly.close()
  })

  return butterfly
}
