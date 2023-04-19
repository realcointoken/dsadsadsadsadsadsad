import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Alert, Flex, Heading, Text } from 'uikit';
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useFetchPublicPoolsData, useFetchUserPools, usePools } from 'state/pools/hooks'
import { usePollFarmsPublicData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { DeserializedPool } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { getAprData } from './helpers'

const CardLayout = styled( FlexLayout )`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${ ( { theme } ) => theme.mediaQueries.sm } {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${ ( { theme } ) => theme.mediaQueries.sm } {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${ Text } {
    font-size: 12px;
  }
`

const ControlStretch = styled( Flex )`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePools()
  const [ stakedOnly, setStakedOnly ] = useUserPoolStakedOnly()
  const [ viewMode, setViewMode ] = useUserPoolsViewMode()
  const [ numberOfPoolsVisible, setNumberOfPoolsVisible ] = useState( NUMBER_OF_POOLS_VISIBLE )
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [ searchQuery, setSearchQuery ] = useState( '' )
  const [ sortOption, setSortOption ] = useState( 'hot' )
  const chosenPoolsLength = useRef( 0 )

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [ finishedPools, openPools ] = useMemo( () => partition( pools, ( pool ) => pool.isFinished ), [ pools ] )
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter( ( pool ) => {
        return pool.userData && new BigNumber( pool.userData.stakedBalance ).isGreaterThan( 0 )
      } ),
    [ finishedPools ],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter( ( pool ) => {
        return pool.userData && new BigNumber( pool.userData.stakedBalance ).isGreaterThan( 0 )
      } ),
    [ openPools ],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsPublicData()
  useFetchPublicPoolsData()
  useFetchUserPools( account )

  useEffect( () => {
    if ( isIntersecting ) {
      setNumberOfPoolsVisible( ( poolsCurrentlyVisible ) => {
        if ( poolsCurrentlyVisible <= chosenPoolsLength.current ) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      } )
    }
  }, [ isIntersecting ] )

  const showFinishedPools = location.pathname.includes( 'history' )

  const handleChangeSearchQuery = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    setSearchQuery( event.target.value )
  }

  const handleSortOptionChange = ( option: OptionProps ): void => {
    setSortOption( option.value )
  }

  const sortPools = ( poolsToSort: DeserializedPool[] ) => {
    switch ( sortOption ) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          ( pool: DeserializedPool ) => (pool.apr ? getAprData( pool, 0 ).apr : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          ( pool: DeserializedPool ) => {
            if ( !pool.userData || !pool.earningTokenPrice ) {
              return 0
            }
            return pool.userData.pendingReward.times( pool.earningTokenPrice ).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          ( pool: DeserializedPool ) => {
            let totalStaked = Number.NaN
            if ( pool.totalStaked?.isFinite() && pool.stakingTokenPrice ) {
              totalStaked =
                +formatUnits( ethers.BigNumber.from( pool.totalStaked.toString() ), pool.stakingToken.decimals ) *
                pool.stakingTokenPrice
            }
            return Number.isFinite( totalStaked ) ? totalStaked : 0
          },
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if ( showFinishedPools ) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if ( searchQuery ) {
    const lowercaseQuery = latinise( searchQuery.toLowerCase() )
    chosenPools = chosenPools.filter( ( pool ) =>
      latinise( pool.earningToken.symbol.toLowerCase() ).includes( lowercaseQuery ),
    )
  }

  chosenPools = sortPools( chosenPools ).slice( 0, numberOfPoolsVisible )
  chosenPoolsLength.current = chosenPools.length

  const cardLayout = (
    <CardLayout>
      { chosenPools.map( ( pool ) =>
        <PoolCard key={ pool.sousId } pool={ pool } account={ account }/>,
      ) }
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={ chosenPools } account={ account } userDataLoaded={ userDataLoaded }/>

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={ [ 'column', null, null, 'row' ] }>
          <Flex flex="1" flexDirection="column" mr={ [ '8px', 0 ] }>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              { t( 'Pools' ) }
            </Heading>
            <Heading scale="md" color="text">
              { t( 'Just stake some tokens to earn.' ) }
            </Heading>
            <Heading scale="md" color="text">
              { t( 'High APR, low risk.' ) }
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls>
          <PoolTabButtons
            stakedOnly={ stakedOnly }
            setStakedOnly={ setStakedOnly }
            hasStakeInFinishedPools={ hasStakeInFinishedPools }
            viewMode={ viewMode }
            setViewMode={ setViewMode }
          />
          <FilterContainer>
            <LabelWrapper>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                { t( 'Sort by' ) }
              </Text>
              <ControlStretch>
                <Select
                  options={ [
                    {
                      label: t( 'Hot' ),
                      value: 'hot',
                    },
                    {
                      label: t( 'APR' ),
                      value: 'apr',
                    },
                    {
                      label: t( 'Earned' ),
                      value: 'earned',
                    },
                    {
                      label: t( 'Total staked' ),
                      value: 'totalStaked',
                    },
                  ] }
                  onOptionChange={ handleSortOptionChange }
                />
              </ControlStretch>
            </LabelWrapper>
            <LabelWrapper style={ { marginLeft: 16 } }>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                { t( 'Search' ) }
              </Text>
              <SearchInput onChange={ handleChangeSearchQuery } placeholder="Search Pools"/>
            </LabelWrapper>
          </FilterContainer>
        </PoolControls>
        { showFinishedPools && (
            <Alert title="Be aware" variant="warning">
              { t( 'These pools are no longer distributing rewards. Please unstake your tokens.' ) }
            </Alert>
        ) }
        { account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading/>
          </Flex>
        ) }
        { viewMode === ViewMode.CARD ? cardLayout : tableLayout }
        <div ref={ observerRef }/>
      </Page>
    </>
  )
}

export default Pools
