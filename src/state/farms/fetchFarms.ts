import { SerializedFarmConfig } from 'config/constants/types'
import fetchFarm from './fetchFarm'

const fetchFarms = async ( farmsToFetch: SerializedFarmConfig[] ) => {
  return Promise.all(
    farmsToFetch.map( async ( farmConfig ) => {
      const farm = await fetchFarm( farmConfig )
      return { ...farm, token: farm.token, quoteToken: farm.quoteToken }
    } ),
  )
}

export default fetchFarms
