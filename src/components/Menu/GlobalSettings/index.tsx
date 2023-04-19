import React from 'react'
import { CogIcon, Flex, IconButton, useModal } from 'uikit'
import SettingsModal from './SettingsModal'

const GlobalSettings = () => {
  const [ onPresentSettingsModal ] = useModal( <SettingsModal/> )

  return (
    <Flex>
      <IconButton onClick={ onPresentSettingsModal } variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
        <CogIcon height={ 24 } width={ 24 } color="textSubtle"/>
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
