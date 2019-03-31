import Butterfly from '~/src/butterfly';
import config from '~/example/config'
import request = require('supertest')

const butterfly = new Butterfly(config)
butterfly.boot()

describe('Routes Test', (): void => {
  it('should respond ok for GET /users', async (): Promise<void> => {
    await request(butterfly.app).get('/users').expect(200)
  })

  it('should respond ok for GET /task', async (): Promise<void> => {
    await request(butterfly.app).get('/tasks').expect(200)
  })
})

butterfly.close()
