import Butterfly from '~/src/butterfly'
import config from '~/example/config'

const butterfly = new Butterfly(config)

butterfly.hook('butterfly:ready', ({ port }): void => {
  console.log(`butterfly is listening on port ${port}`)
})

butterfly.boot()
