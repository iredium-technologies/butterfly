export const databases = (): object => ({
  mongo: {
    enable: true,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  },
  redis: {
    enable: true,
    host: '127.0.0.1',
    port: 6379,
    password: null
  }
})
