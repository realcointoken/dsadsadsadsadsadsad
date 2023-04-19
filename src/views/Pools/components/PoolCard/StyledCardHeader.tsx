import React from 'react'
import { CardHeader, Flex, Heading, Text } from 'uikit'
import { Token } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TokenImage, TokenPairImage } from 'components/TokenImage'

const Wrapper = styled( CardHeader )<{ isFinished?: boolean; background?: string }>`
  background: ${ ( { isFinished, background, theme } ) =>
  isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background] };
  border-radius: ${ ( { theme } ) => `${ theme.radii.card } ${ theme.radii.card } 0 0` };
`

const StyledCardHeader: React.FC<{
  earningToken: Token
  stakingToken: Token
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ( { earningToken, stakingToken, isFinished = false, isAutoVault = false, isStaking = false } ) => {
  const { t } = useTranslation()
  const isCakePool = earningToken.symbol === 'VANI' && stakingToken.symbol === 'VANI'
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  const getHeadingPrefix = () => {
    if ( isCakePool ) {
      // manual cake
      return t( 'Manual' )
    }
    // all other pools
    return t( 'Earn' )
  }

  const getSubHeading = () => {
    if ( isAutoVault ) {
      return t( 'Automatic restaking' )
    }
    if ( isCakePool ) {
      return t( 'Earn VANI, stake VANI' )
    }
    return t( 'Stake %symbol%', { symbol: stakingToken.symbol } )
  }

  return (
    <Wrapper isFinished={ isFinished } background={ background }>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={ isFinished ? 'textDisabled' : 'body' } scale="lg">
            { `${ getHeadingPrefix() } ${ earningToken.symbol }` }
          </Heading>
          <Text color={ isFinished ? 'textDisabled' : 'textSubtle' }>{ getSubHeading() }</Text>
        </Flex>
        { earningToken.address === stakingToken.address ?
            <TokenImage height={ 64 } width={ 64 } token={ stakingToken } /> :
            <TokenPairImage primaryToken={ earningToken } secondaryToken={ stakingToken } width={ 64 } height={ 64 }/>
        }
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
