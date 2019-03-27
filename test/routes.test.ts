import Butterfly from '~/src/butterfly';
import config from '~/example/config'
import request = require('supertest')

const butterfly = new Butterfly(config)
butterfly.boot()

describe('Routes Test', (): void => {
  it('should respond ok', async (): Promise<void> => {
    await request(butterfly.app).get('/users').expect(200)
  })
})

describe('GET /tasks', (): void => {
  it('should respond ok', async (): Promise<void> => {
    await request(butterfly.app).get('/tasks').expect(200)
  })
})

butterfly.close()
