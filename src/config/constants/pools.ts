import { serializeTokens } from './tokens'
import { PoolCategory, SerializedPoolConfig } from './types'
import { getMasterChefAddress } from '../../utils/addressHelpers';

const serializedTokens = serializeTokens()

const pools: SerializedPoolConfig[] = [
  {
    sousId: 0,
    stakingToken: serializedTokens.vani,
    earningToken: serializedTokens.vani,
    contractAddress: {
      97: '',
      56: getMasterChefAddress(),
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.005',
    sortOrder: 1,
    isFinished: false,
    isMasterPool: true
  },
  {
    sousId: 4,
    stakingToken: serializedTokens.glto,
    earningToken: serializedTokens.vani,
    contractAddress: {
      97: '',
      56: getMasterChefAddress(),
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.005',
    sortOrder: 2,
    isFinished: false,
    isMasterPool: true
  },
]

export default pools
