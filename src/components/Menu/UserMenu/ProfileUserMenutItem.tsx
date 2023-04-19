import React from 'react'
import { Skeleton, UserMenuItem } from 'uikit'

interface ProfileUserMenuItemProps {
  isLoading: boolean
  hasProfile: boolean
}

const ProfileUserMenuItem: React.FC<ProfileUserMenuItemProps> = ( { isLoading } ) => {
  if ( isLoading ) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%"/>
      </UserMenuItem>
    )
  }

  return (
    <></>
  )
}

export default ProfileUserMenuItem
