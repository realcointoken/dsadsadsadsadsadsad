// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.

const getLiquidityUrlPathParts = ( {
                                     quoteTokenAddress,
                                     tokenAddress,
                                   }: {
  quoteTokenAddress: string
  tokenAddress: string
} ): string => {
  const firstPart = quoteTokenAddress ?? 'WBNB'
  const secondPart = tokenAddress ?? 'WBNB'
  return `${ firstPart }/${ secondPart }`
}

export default getLiquidityUrlPathParts
