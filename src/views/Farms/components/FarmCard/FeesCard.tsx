import React from 'react'
import { Flex, Text } from 'uikit'
import styled from 'styled-components'
import { FeesProps } from 'state/types'

interface FeesCardProps {
  fees: FeesProps
}

const FeesContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const FeesCard: React.FC<FeesCardProps> = ( { fees } ) => (
  <FeesContainer>
    <Flex justifyContent="space-between">
      <Text small>Harvest Fee:</Text>
      {
        fees?.harvestFee ?
          <Text small bold>{ `${ fees.harvestFee / 100 }%` }</Text> :
          <Text small>-</Text>
      }
    </Flex>
    <Flex justifyContent="space-between">
      <Text small>Deposit Fee:</Text>
      {
        fees?.depositFee ?
          <Text small bold>{ `${ fees.depositFee / 100 }%` }</Text> :
          <Text small>-</Text>
      }
    </Flex>
    <Flex justifyContent="space-between">
      <Text small>Withdraw Fee:</Text>
      {
        fees?.taxWithdraw ?
          <Text small bold>{ `${ fees.taxWithdraw / 100 }%` }</Text> :
          <Text small>-</Text>
      }
    </Flex>
  </FeesContainer>
)

export default FeesCard
