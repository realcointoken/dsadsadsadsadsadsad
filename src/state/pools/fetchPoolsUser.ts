import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers';
import { simpleRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter( ( pool ) => pool.stakingToken.symbol !== 'BNB' )
const bnbPools = poolsConfig.filter( ( pool ) => pool.stakingToken.symbol === 'BNB' )
const nonMasterPools = poolsConfig.filter( ( pool ) => !pool.isMasterPool )
const masterPools = poolsConfig.filter( ( pool ) => pool.isMasterPool )

export const fetchPoolsAllowance = async ( account ) => {
  const calls = nonBnbPools.map( ( pool ) => ({
    address: pool.stakingToken.address,
    name: 'allowance',
    params: [ account, getAddress( pool.contractAddress ) ],
  }) )

  const allowances = await multicall( erc20ABI, calls )
  return nonBnbPools.reduce(
    ( acc, pool, index ) => ({ ...acc, [pool.sousId]: new BigNumber( allowances[index] ).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async ( account ) => {
  // Non BNB pools
  const calls = nonBnbPools.map( ( pool ) => ({
    address: pool.stakingToken.address,
    name: 'balanceOf',
    params: [ account ],
  }) )
  const tokenBalancesRaw = await multicall( erc20ABI, calls )
  const tokenBalances = nonBnbPools.reduce(
    ( acc, pool, index ) => ({ ...acc, [pool.sousId]: new BigNumber( tokenBalancesRaw[index] ).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await simpleRpcProvider.getBalance( account )
  const bnbBalances = bnbPools.reduce(
    ( acc, pool ) => ({ ...acc, [pool.sousId]: new BigNumber( bnbBalance.toString() ).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async ( account ) => {
  const souschefCalls = nonMasterPools.map( ( p ) => ({
    address: getAddress( p.contractAddress ),
    name: 'userInfo',
    params: [ account ],
  }) )

  const souschefUserInfo = await multicall( sousChefABI, souschefCalls )

  const souschefStakedBalances = nonMasterPools.reduce(
      ( acc, pool, index ) => ({
        ...acc,
        [pool.sousId]: new BigNumber( souschefUserInfo[index].amount._hex ).toJSON(),
      }),
      {},
  )

  // Master Pools
  const masterchefCalls = masterPools.map( ( p ) => ({
    address: getMasterChefAddress(),
    name: 'userInfo',
    params: [ `${ p.sousId }`, account ],
  }) )

  const masterchefUserInfo = await multicall( masterchefABI, masterchefCalls )

  const masterchefStakedBalances = masterPools.reduce(
      ( acc, pool, index ) => ({
        ...acc,
        [pool.sousId]: new BigNumber( masterchefUserInfo[index].amount._hex ).toJSON(),
      }),
      {},
  )

  return { ...souschefStakedBalances, ...masterchefStakedBalances }
}

export const fetchUserPendingRewards = async ( account ) => {
  const souschefCalls = nonMasterPools.map( ( p ) => ({
    address: getAddress( p.contractAddress ),
    name: 'pendingToken',
    params: [ account ],
  }) )

  const souschefData = await multicall( sousChefABI, souschefCalls )

  const souschefPendingRewards = nonMasterPools.reduce(
      ( acc, pool, index ) => ({
        ...acc,
        [pool.sousId]: new BigNumber( souschefData[index] ).toJSON(),
      }),
      {},
  )

  // Master Pools
  const masterchefCalls = masterPools.map( ( p ) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingToken',
    params: [ `${ p.sousId }`, account ],
  }) )

  const masterchefData = await multicall( masterchefABI, masterchefCalls )

  const masterchefPendingRewards = masterPools.reduce(
      ( acc, pool, index ) => ({
        ...acc,
        [pool.sousId]: new BigNumber( masterchefData[index] ).toJSON(),
      }),
      {},
  )

  return { ...souschefPendingRewards, ...masterchefPendingRewards }
}
