import React from 'react'
import { Flex, Text } from 'uikit'
import styled from 'styled-components'
import { FeesProps } from 'state/types'

interface FeesCellProps {
  fees: FeesProps
}

export const FeesContainer = styled.div`
  padding: 16px;
  border: 2px solid ${ ( { theme } ) => theme.colors.input };
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;

  ${ ( { theme } ) => theme.mediaQueries.sm } {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    max-height: 100px;
  }

  ${ ( { theme } ) => theme.mediaQueries.xl } {
    margin-left: 48px;
    margin-right: 0;
    margin-bottom: 0;
    max-height: 100px;
  }
`

const FeesCell: React.FC<FeesCellProps> = ( { fees } ) => (
  <FeesContainer>
    <Flex justifyContent="space-between">
      <Text>Harvest Fee:</Text>
      {
        fees?.harvestFee ?
          <Text bold>{ `${ fees.harvestFee / 100 }%` }</Text> :
          <Text>-</Text>
      }
    </Flex>
    <Flex justifyContent="space-between">
      <Text>Deposit Fee:</Text>
      {
        fees?.depositFee ?
          <Text bold>{ `${ fees.depositFee / 100 }%` }</Text> :
          <Text>-</Text>
      }
    </Flex>
    <Flex justifyContent="space-between">
      <Text>Withdraw Fee:</Text>
      {
        fees?.taxWithdraw ?
          <Text bold>{ `${ fees.taxWithdraw / 100 }%` }</Text> :
          <Text>-</Text>
      }
    </Flex>
  </FeesContainer>
)

export default FeesCell