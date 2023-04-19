import { MenuItemsType } from '../../components/MenuItems/types'
import { LinkStatus } from './types'

export const status = {
  LIVE: <LinkStatus>{
    text: 'LIVE',
    color: 'failure',
  },
  SOON: <LinkStatus>{
    text: 'SOON',
    color: 'warning',
  },
  NEW: <LinkStatus>{
    text: 'NEW',
    color: 'success',
  },
}

export const links: MenuItemsType[] = []

export const MENU_HEIGHT = 56
export const MENU_ENTRY_HEIGHT = 48
export const MOBILE_MENU_HEIGHT = 44
export const SIDEBAR_WIDTH_FULL = 240
export const SIDEBAR_WIDTH_REDUCED = 56
