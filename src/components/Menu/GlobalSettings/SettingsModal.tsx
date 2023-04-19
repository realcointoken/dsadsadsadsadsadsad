import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, InjectedModalProps, Modal, Text, ThemeSwitcher, Toggle } from 'uikit'
import { useExpertModeManager, useUserExpertModeAcknowledgementShow } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import useTheme from 'hooks/useTheme'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'

const ScrollableContainer = styled( Flex )`
  flex-direction: column;
  max-height: 400px;
  ${ ( { theme } ) => theme.mediaQueries.sm } {
    max-height: none;
  }
`

const SettingsModal: React.FC<InjectedModalProps> = ( { onDismiss } ) => {
  const [ showConfirmExpertModal, setShowConfirmExpertModal ] = useState( false )
  const [ showExpertModeAcknowledgement, setShowExpertModeAcknowledgement ] = useUserExpertModeAcknowledgementShow()
  const [ expertMode, toggleExpertMode ] = useExpertModeManager()
  const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()
  const { theme, isDark, toggleTheme } = useTheme()

  if ( showConfirmExpertModal ) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={ setShowConfirmExpertModal }
        onDismiss={ onDismiss }
        setShowExpertModeAcknowledgement={ setShowExpertModeAcknowledgement }
      />
    )
  }

  const handleExpertModeToggle = () => {
    if ( expertMode ) {
      onChangeRecipient( null )
      toggleExpertMode()
    } else if ( !showExpertModeAcknowledgement ) {
      onChangeRecipient( null )
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal( true )
    }
  }

  return (
    <Modal
      title={ t( 'Settings' ) }
      headerBackground="gradients.cardHeader"
      onDismiss={ onDismiss }
      style={ { maxWidth: '420px' } }
    >
      <ScrollableContainer>
        <Flex pb="24px" flexDirection="column">
          <Text bold textTransform="uppercase" fontSize="12px" color="secondary" mb="24px">
            { t( 'Global' ) }
          </Text>
          <Flex justifyContent="space-between">
            <Text mb="24px">{ t( 'Dark mode' ) }</Text>
            <ThemeSwitcher isDark={ isDark } toggleTheme={ toggleTheme }/>
          </Flex>
          <GasSettings/>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="24px">
          <Flex alignItems="center">
            <Text>{ t( 'Expert Mode' ) }</Text>
            <QuestionHelper
              text={ t( 'Bypasses confirmation modals and allows high slippage trades. Use at your own risk.' ) }
              placement="top-start"
              ml="4px"
            />
          </Flex>
          <Toggle id="toggle-expert-mode-button" scale="md" checked={ expertMode } onChange={ handleExpertModeToggle }/>
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
