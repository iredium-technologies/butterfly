import Butterfly from '~/src/butterfly'
import config from '~/example/config'

const butterfly = new Butterfly(config)

butterfly.hook('butterfly:ready', ({ port }): void => {
  console.log(`butterfly is listening on port ${port}`)
})

butterfly.hook('butterfly:onError', (error): void => {
  console.error(error)
})

butterfly.boot()
