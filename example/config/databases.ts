export const databases = (): object => ({
  mongo: {
    enable: false,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  }
})
