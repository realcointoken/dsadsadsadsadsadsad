import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import erc20 from 'config/abi/erc20.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { SerializedBigNumber, SerializedFarm, FeesProps } from '../types'

type PublicFarmData = {
  tokenAmountTotal: SerializedBigNumber,
  lpTotalInQuoteToken: SerializedBigNumber,
  lpTotalSupply: SerializedBigNumber,
  tokenPriceVsQuote: SerializedBigNumber,
  poolWeight: SerializedBigNumber,
  multiplier: string,
  fees: FeesProps
}

const fetchFarm = async ( farm: SerializedFarm ): Promise<PublicFarmData> => {
  const { pid, lpAddresses, token, quoteToken } = farm
  const lpAddress = getAddress( lpAddresses )
  const calls = [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [ lpAddress ],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [ lpAddress ],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [ getMasterChefAddress() ],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token.address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]

  const [
    tokenBalanceLP,
    quoteTokenBalanceLP,
    lpTokenBalanceMC,
    lpTotalSupply,
    tokenDecimals,
    quoteTokenDecimals,
  ] = await multicall( erc20, calls )

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber( lpTokenBalanceMC ).div( new BigNumber( lpTotalSupply ) )

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber( tokenBalanceLP ).div( BIG_TEN.pow( tokenDecimals ) )
  const quoteTokenAmountTotal = new BigNumber( quoteTokenBalanceLP ).div( BIG_TEN.pow( quoteTokenDecimals ) )

  // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMc = quoteTokenAmountTotal.times( lpTokenRatio )

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times( new BigNumber( 2 ) )

  // console.group( farm.lpSymbol )
  // console.log( {
  //     farmPid: farm.pid,
  //     lpAddress,
  //     tokenAddress: token.address,
  //     tokenDecimals,
  //     quoteTokenDecimals,
  //   },
  //   { calls },
  //   {
  //     tokenAmountTotal: tokenAmountTotal.toString(),
  //     quoteTokenBalanceLP: quoteTokenBalanceLP.toString(),
  //     tokenBalanceLP: tokenBalanceLP.toString(),
  //     lpTokenRatio: lpTokenRatio.toString(),
  //     tokenPriceVsQuote: quoteTokenAmountTotal.toString(),
  //     lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
  //     lpTokenBalanceMC: lpTokenBalanceMC.toString(),
  //     lpTotalSupply: lpTotalSupply.toString(),
  //     quoteTokenAmountMc: quoteTokenAmountMc.toString(),
  //   } )
  // console.groupEnd()

  // Only make masterchef calls if farm has pid
  const [ info, totalAllocPoint ] =
    pid || pid === 0
      ? await multicall( masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [ pid ],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ] )
      : [ null, null ]

  const allocPoint = info ? new BigNumber( info.allocPoint?._hex ) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div( new BigNumber( totalAllocPoint ) ) : BIG_ZERO

  const fees = {
    harvestFee: info ? info?.harvestFee : 0,
    depositFee: info ? info?.depositFee : 0,
    taxWithdraw: info ? info?.taxWithdraw : 0,
    taxWithdrawBeforeLock: info ? info?.taxWithdrawBeforeLock : 0,
  }

  return {
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber( lpTotalSupply ).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div( tokenAmountTotal ).toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${ allocPoint.div( 100 ).toString() }X`,
    fees
  }
}

export default fetchFarm
