import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import { AppThunk, PoolsState, SerializedPool } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { fetchPoolsBlockLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from './fetchPools'
import { fetchPoolsAllowance, fetchUserBalances, fetchUserPendingRewards, fetchUserStakeBalances } from './fetchPoolsUser'
import { getTokenPricesFromFarm } from './helpers'

const initialState: PoolsState = {
  data: [ ...poolsConfig ],
  userDataLoaded: false,
}

// Thunks
export const fetchPoolsPublicDataAsync = ( currentBlock: number ) => async ( dispatch, getState ) => {
  // console.debug( 'fetchPoolsPublicDataAsync with currentBlock=', currentBlock )

  const blockLimits = await fetchPoolsBlockLimits( currentBlock )
  // console.debug( 'fetchPoolsBlockLimits:', blockLimits )

  const totalStakings = await fetchPoolsTotalStaking()
  // console.debug( 'fetchPoolsTotalStaking:', totalStakings )

  const prices = getTokenPricesFromFarm( getState().farms.data )
  // console.debug( 'getTokenPricesFromFarm:', prices )

  const liveData = poolsConfig.map( ( pool ) => {
    const blockLimit = blockLimits.find( ( entry ) => entry.sousId === pool.sousId )
    const totalStaking = totalStakings.find( ( entry ) => entry.sousId === pool.sousId )
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number( blockLimit.endBlock ) : false
    const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

    const stakingTokenAddress = pool.stakingToken.address ? pool.stakingToken.address.toLowerCase() : null
    const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

    const earningTokenAddress = pool.earningToken.address ? pool.earningToken.address.toLowerCase() : null
    const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
    const apr = !isPoolFinished
      ? getPoolApr(
        stakingTokenPrice,
        earningTokenPrice,
        getBalanceNumber( new BigNumber( totalStaking.totalStaked ), pool.stakingToken.decimals ),
        parseFloat( pool.tokenPerBlock ),
      )
      : 0

    return {
      ...blockLimit,
      ...totalStaking,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      isFinished: isPoolFinished,
    }
  } )

  dispatch( setPoolsPublicData( liveData ) )
}

export const fetchPoolsStakingLimitsAsync = () => async ( dispatch, getState ) => {
  const poolsWithStakingLimit = getState().pools.data
                                          .filter( ( { stakingLimit } ) => stakingLimit !== null && stakingLimit !== undefined )
                                          .map( ( pool ) => pool.sousId )

  const stakingLimits = await fetchPoolsStakingLimits( poolsWithStakingLimit )

  const stakingLimitData = poolsConfig.map( ( pool ) => {
    if ( poolsWithStakingLimit.includes( pool.sousId ) ) {
      return { sousId: pool.sousId }
    }
    const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
    return {
      sousId: pool.sousId,
      stakingLimit: stakingLimit.toJSON(),
    }
  } )

  dispatch( setPoolsPublicData( stakingLimitData ) )
}

export const fetchPoolsUserDataAsync = ( account: string ): AppThunk => async ( dispatch ) => {
  const allowances = await fetchPoolsAllowance( account )
  // console.debug({ allowances })

  const stakingTokenBalances = await fetchUserBalances( account )
  // console.debug({ stakingTokenBalances })

  const stakedBalances = await fetchUserStakeBalances( account )
  // console.debug({ stakedBalances })

  const pendingRewards = await fetchUserPendingRewards( account )
  // console.debug({ pendingRewards })

  const userData = poolsConfig.map( ( pool ) => ({
    sousId: pool.sousId,
    allowance: allowances[pool.sousId],
    stakingTokenBalance: stakingTokenBalances[pool.sousId],
    stakedBalance: stakedBalances[pool.sousId],
    pendingReward: pendingRewards[pool.sousId],
  }) )

  dispatch( setPoolsUserData( userData ) )
}

export const updateUserAllowance =
  ( sousId: number, account: string ): AppThunk =>
    async ( dispatch ) => {
      const allowances = await fetchPoolsAllowance( account )
      dispatch( updatePoolsUserData( { sousId, field: 'allowance', value: allowances[sousId] } ) )
    }

export const updateUserBalance =
  ( sousId: number, account: string ): AppThunk =>
    async ( dispatch ) => {
      const tokenBalances = await fetchUserBalances( account )
      dispatch( updatePoolsUserData( { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] } ) )
    }

export const updateUserStakedBalance =
  ( sousId: number, account: string ): AppThunk =>
    async ( dispatch ) => {
      const stakedBalances = await fetchUserStakeBalances( account )
      dispatch( updatePoolsUserData( { sousId, field: 'stakedBalance', value: stakedBalances[sousId] } ) )
    }

export const updateUserPendingReward =
  ( sousId: number, account: string ): AppThunk =>
    async ( dispatch ) => {
      const pendingRewards = await fetchUserPendingRewards( account )
      dispatch( updatePoolsUserData( { sousId, field: 'pendingReward', value: pendingRewards[sousId] } ) )
    }

export const PoolsSlice = createSlice( {
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsPublicData: ( state, action ) => {
      const livePoolsData: SerializedPool[] = action.payload
      state.data = state.data.map( ( pool ) => {
        const livePoolData = livePoolsData.find( ( entry ) => entry.sousId === pool.sousId )
        return { ...pool, ...livePoolData }
      } )
    },
    setPoolsUserData: ( state, action ) => {
      const userData = action.payload
      state.data = state.data.map( ( pool ) => {
        const userPoolData = userData.find( ( entry ) => entry.sousId === pool.sousId )
        return { ...pool, userData: userPoolData }
      } )
      state.userDataLoaded = true
    },
    updatePoolsUserData: ( state, action ) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex( ( p ) => p.sousId === sousId )

      if ( index >= 0 ) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
  extraReducers: ( /* builder */ ) => {
    //
  },
} )

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData } = PoolsSlice.actions

export default PoolsSlice.reducer
