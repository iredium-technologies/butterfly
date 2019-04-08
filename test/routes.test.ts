import Butterfly from '~/src/butterfly';
import config from '~/example/config'
import request = require('supertest')

describe('Routes Test', (): void => {
  it('should respond ok for GET /users', async (): Promise<void> => {
    const butterfly = new Butterfly(config)
    await butterfly.boot()
    request(butterfly.app).get('/users').expect(200)
    await butterfly.close()
  })


  it('should respond ok for GET /task', async (): Promise<void> => {
    const butterfly = new Butterfly(config)
    await butterfly.boot()
    request(butterfly.app).get('/tasks').expect(200)
    await butterfly.close()
  })
})
