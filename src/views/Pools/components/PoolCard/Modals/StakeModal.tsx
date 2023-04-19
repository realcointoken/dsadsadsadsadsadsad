import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, BalanceInput, Button, Flex, Image, Link, Modal, Slider, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { formatNumber, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { BASE_SWAP_URL } from 'config';
import { DeserializedPool } from 'state/types'
import PercentageButton from './PercentageButton'
import useStakePool from '../../../hooks/useStakePool'
import useUnstakePool from '../../../hooks/useUnstakePool'

interface StakeModalProps {
  isBnbPool: boolean
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledLink = styled( Link )`
  width: 100%;
`

const StakeModal: React.FC<StakeModalProps> = ( {
                                                  isBnbPool,
                                                  pool,
                                                  stakingTokenBalance,
                                                  stakingTokenPrice,
                                                  isRemovingStake = false,
                                                  onDismiss,
                                                } ) => {
  const { sousId, stakingToken, earningTokenPrice, apr, userData, stakingLimit, earningToken, isMasterPool } = pool
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useStakePool( sousId, isMasterPool, isBnbPool )
  const { onUnstake } = useUnstakePool( sousId, isMasterPool, pool.enableEmergencyWithdraw )
  const { toastSuccess, toastError } = useToast()
  const [ pendingTx, setPendingTx ] = useState( false )
  const [ stakeAmount, setStakeAmount ] = useState( '' )
  const [ hasReachedStakeLimit, setHasReachedStakedLimit ] = useState( false )
  const [ percent, setPercent ] = useState( 0 )
  const [ showRoiCalculator, setShowRoiCalculator ] = useState( false )
  const getCalculatedStakingLimit = () => {
    if ( isRemovingStake ) {
      return userData.stakedBalance
    }
    return stakingLimit.gt( 0 ) && stakingTokenBalance.gt( stakingLimit ) ? stakingLimit : stakingTokenBalance
  }
  const fullDecimalStakeAmount = getDecimalAmount( new BigNumber( stakeAmount ), stakingToken.decimals )
  const userNotEnoughToken = isRemovingStake
    ? userData.stakedBalance.lt( fullDecimalStakeAmount )
    : userData.stakingTokenBalance.lt( fullDecimalStakeAmount )

  const usdValueStaked = new BigNumber( stakeAmount ).times( stakingTokenPrice )
  const formattedUsdValueStaked = !usdValueStaked.isNaN() && formatNumber( usdValueStaked.toNumber() )

  const getTokenLink = stakingToken.address ? `${ BASE_SWAP_URL }?outputCurrency=${ stakingToken.address }` : BASE_SWAP_URL

  useEffect( () => {
    if ( stakingLimit.gt( 0 ) && !isRemovingStake ) {
      setHasReachedStakedLimit( fullDecimalStakeAmount.plus( userData.stakedBalance ).gt( stakingLimit ) )
    }
  }, [
    stakeAmount,
    stakingLimit,
    userData,
    stakingToken,
    isRemovingStake,
    setHasReachedStakedLimit,
    fullDecimalStakeAmount,
  ] )

  const handleStakeInputChange = ( input: string ) => {
    if ( input ) {
      const convertedInput = getDecimalAmount( new BigNumber( input ), stakingToken.decimals )
      const percentage = Math.floor( convertedInput.dividedBy( getCalculatedStakingLimit() ).multipliedBy( 100 ).toNumber() )
      setPercent( Math.min( percentage, 100 ) )
    } else {
      setPercent( 0 )
    }
    setStakeAmount( input )
  }

  const handleChangePercent = ( sliderPercent: number ) => {
    if ( sliderPercent > 0 ) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy( 100 ).multipliedBy( sliderPercent )
      const amountToStake = getFullDisplayBalance( percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals )
      setStakeAmount( amountToStake )
    } else {
      setStakeAmount( '' )
    }
    setPercent( sliderPercent )
  }

  const handleConfirmClick = async () => {
    setPendingTx( true )
    try {
      if ( isRemovingStake ) {
        // unstaking
        await onUnstake( stakeAmount, stakingToken.decimals )
        toastSuccess(
          `${ t( 'Unstaked' ) }!`,
          t( 'Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: earningToken.symbol,
          } ),
        )
      } else {
        // staking
        await onStake( stakeAmount, stakingToken.decimals )
        toastSuccess(
          `${ t( 'Staked' ) }!`,
          t( 'Your %symbol% funds have been staked in the pool!', {
            symbol: stakingToken.symbol,
          } ),
        )
      }
      setPendingTx( false )
      onDismiss()
    } catch ( e ) {
      console.error(e);
      toastError( t( 'Error' ), t( 'Please try again. Confirm the transaction and make sure you are paying enough gas!' ) )
      setPendingTx( false )
    }
  }

  if ( showRoiCalculator ) {
    return (
      <RoiCalculatorModal
        earningTokenPrice={ earningTokenPrice }
        stakingTokenPrice={ stakingTokenPrice }
        apr={ apr }
        linkLabel={ t( 'Get %symbol%', { symbol: stakingToken.symbol } ) }
        linkHref={ getTokenLink }
        stakingTokenBalance={ userData.stakedBalance.plus( stakingTokenBalance ) }
        stakingTokenSymbol={ stakingToken.symbol }
        earningTokenSymbol={ earningToken.symbol }
        onBack={ () => setShowRoiCalculator( false ) }
        initialValue={ stakeAmount }
      />
    )
  }

  return (
    <Modal
      minWidth="346px"
      title={ isRemovingStake ? t( 'Unstake' ) : t( 'Stake in Pool' ) }
      onDismiss={ onDismiss }
      headerBackground={ theme.colors.gradients.cardHeader }
    >
      { stakingLimit.gt( 0 ) && !isRemovingStake && (
        <Text color="secondary" bold mb="24px" style={ { textAlign: 'center' } } fontSize="16px">
          { t( 'Max stake for this pool: %amount% %token%', {
            amount: getFullDisplayBalance( stakingLimit, stakingToken.decimals, 0 ),
            token: stakingToken.symbol,
          } ) }
        </Text>
      ) }
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{ isRemovingStake ? t( 'Unstake' ) : t( 'Stake' ) }:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={ `/images/tokens/${ stakingToken.address }.png` } width={ 24 } height={ 24 } alt={ stakingToken.symbol }/>
          <Text ml="4px" bold>
            { stakingToken.symbol }
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={ stakeAmount }
        onUserInput={ handleStakeInputChange }
        currencyValue={ stakingTokenPrice !== 0 && `~${ formattedUsdValueStaked || 0 } USD` }
        isWarning={ hasReachedStakeLimit || userNotEnoughToken }
        decimals={ stakingToken.decimals }
      />
      { hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={ { textAlign: 'right' } } mt="4px">
          { t( 'Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance( new BigNumber( stakingLimit ), stakingToken.decimals, 0 ),
            token: stakingToken.symbol,
          } ) }
        </Text>
      ) }
      { userNotEnoughToken && (
        <Text color="failure" fontSize="12px" style={ { textAlign: 'right' } } mt="4px">
          { t( 'Insufficient %symbol% balance', {
            symbol: stakingToken.symbol,
          } ) }
        </Text>
      ) }
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        { t( 'Balance: %balance%', {
          balance: getFullDisplayBalance( getCalculatedStakingLimit(), stakingToken.decimals ),
        } ) }
      </Text>
      <Slider
        min={ 0 }
        max={ 100 }
        value={ percent }
        onValueChanged={ handleChangePercent }
        name="stake"
        valueLabel={ `${ percent }%` }
        step={ 1 }
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={ () => handleChangePercent( 25 ) }>25%</PercentageButton>
        <PercentageButton onClick={ () => handleChangePercent( 50 ) }>50%</PercentageButton>
        <PercentageButton onClick={ () => handleChangePercent( 75 ) }>75%</PercentageButton>
        <PercentageButton onClick={ () => handleChangePercent( 100 ) }>{ t( 'Max' ) }</PercentageButton>
      </Flex>
      <Button
        isLoading={ pendingTx }
        endIcon={ pendingTx ? <AutoRenewIcon spin color="currentColor"/> : null }
        onClick={ handleConfirmClick }
        disabled={ !stakeAmount || parseFloat( stakeAmount ) === 0 || hasReachedStakeLimit || userNotEnoughToken }
        mt="24px"
      >
        { pendingTx ? t( 'Confirming' ) : t( 'Confirm' ) }
      </Button>
      { !isRemovingStake && (
        <StyledLink external href={ getTokenLink }>
          <Button width="100%" mt="8px" variant="secondary">
            { t( 'Get %symbol%', { symbol: stakingToken.symbol } ) }
          </Button>
        </StyledLink>
      ) }
    </Modal>
  )
}

export default StakeModal
