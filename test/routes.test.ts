import request = require('supertest')
import { initTest } from './helpers/init-test';

const butterfly = initTest()

describe('Routes Test', (): void => {
  it('should respond ok for GET /users', async (): Promise<void> => {
    request(butterfly.app).get('/users').expect(200)
  })


  it('should respond ok for GET /task', async (): Promise<void> => {
    request(butterfly.app).get('/tasks').expect(200)
  })
})
