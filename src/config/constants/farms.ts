import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import { FARM_BUSD_WBNB_PID, FARM_VANI_WBNB_PID } from '../index'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'VANI',
    lpAddresses: {
      97: '',
      56: serializedTokens.vani.address,
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.vani,
  },
  {
    pid: FARM_VANI_WBNB_PID,
    lpSymbol: 'VANI-WBNB',
    lpAddresses: {
      97: '',
      56: '0x19459bC088A8aC808974c143Dc165895752E22b0',
    },
    token: serializedTokens.vani,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'VANI-BUSD',
    lpAddresses: {
      97: '',
      56: '0x23776B8e5C48dd91586FF335C8B59DB58B4522E6',
    },
    token: serializedTokens.vani,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: FARM_BUSD_WBNB_PID,
    lpSymbol: 'BUSD-WBNB LP',
    lpAddresses: {
      97: '',
      56: '0x72Cd52024809B2296428a31C6D928C4166E37725',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
]

export default farms
