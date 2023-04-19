import React, { useState } from 'react'
import BottomNavItem from '../BottomNavItem'
import StyledBottomNav, { StyledOverlay } from './styles'
import { Box } from '../Box'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { BottomNavProps } from './types'
import { NotificationDot } from '../NotificationDot'

const BottomNav: React.FC<BottomNavProps> = ( props ) => {
  const { items: links = [], activeItem = '', activeSubItem = '' } = props

  const [ menuOpenByIndex, setMenuOpenByIndex ] = useState( {} )

  const items = [
    {
      label: 'Home',
      href: '/',
      icon: 'Home',
      items: [],
    },
    ...links,
  ]

  const isBottomMenuOpen = Object.values( menuOpenByIndex ).reduce( ( acc, value ) => acc || value, false )
  return (
    <>
      { isBottomMenuOpen && <StyledOverlay/> }
      <StyledBottomNav justifyContent="space-around" { ...props }>
        { items.map( ( { label, items: menuItems, href, icon, showOnMobile = true, showItemsOnMobile = true }, index ) => {
          const statusColor = menuItems?.find( ( menuItem ) => menuItem.status !== undefined )?.status?.color
          return (
            showOnMobile && (
              menuItems.length <= 0 ?
                <BottomNavItem
                  key={ label }
                  href={ href }
                  isActive={ href === activeItem }
                  label={ label }
                  iconName={ icon }
                  showItemsOnMobile={ showItemsOnMobile }
                /> :
                <DropdownMenu
                  key={ label }
                  items={ menuItems }
                  isBottomNav
                  activeItem={ activeSubItem }
                  showItemsOnMobile={ showItemsOnMobile }
                  setMenuOpenByIndex={ setMenuOpenByIndex }
                  index={ index }
                >
                  <Box>
                    <NotificationDot show={ !!statusColor } color={ statusColor }>
                      <BottomNavItem
                        href={ href }
                        isActive={ href === activeItem }
                        label={ label }
                        iconName={ icon }
                        showItemsOnMobile={ showItemsOnMobile }
                      />
                    </NotificationDot>
                  </Box>
                </DropdownMenu>
            )
          )
        } ) }
      </StyledBottomNav>
    </>
  )
}

export default BottomNav