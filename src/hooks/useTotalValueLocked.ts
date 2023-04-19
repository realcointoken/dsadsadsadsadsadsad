import BigNumber from 'bignumber.js'
import { usePools } from '../state/pools/hooks'
import { useFarms } from '../state/farms/hooks'
import { getBalanceAmount, roundNumber } from '../utils/formatBalance'

export const useTotalValueLocked = (): number => {
  const { data: farms } = useFarms()
  const { pools } = usePools()

  let tvl = new BigNumber( 0 )

  for ( let i = 0; i < farms.length; i++ ) {
    const farm = farms[i]
    let farmLiquidity = new BigNumber( 0 )

    if ( farm.lpTotalInQuoteToken ) {
      if ( farm.quoteTokenPriceBusd ) {
        farmLiquidity = new BigNumber( farm.lpTotalInQuoteToken ).times( farm.quoteTokenPriceBusd )
      } else {
        farmLiquidity = farm.lpTotalInQuoteToken
      }
    }

    if ( !farmLiquidity.isNaN() && farmLiquidity.isFinite() ) {
      tvl = tvl.plus( farmLiquidity )
    }
  }

  for ( let i = 0; i < pools.length; i++ ) {
    const pool = pools[i]
    let poolLiquidity = null

    const { stakingToken, stakingTokenPrice: stakingTokenPriceBusd, totalStaked } = pool

    if ( totalStaked?.isFinite() && stakingTokenPriceBusd ) {
      poolLiquidity = getBalanceAmount(
        new BigNumber( pool.totalStaked ).multipliedBy( stakingTokenPriceBusd ),
        stakingToken.decimals,
      )

      if ( !poolLiquidity.isNaN() && poolLiquidity.isFinite() ) {
        tvl = tvl.plus( poolLiquidity )
      }
    }
  }

  return roundNumber( tvl.toNumber(), 2 );
}