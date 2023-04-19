import { DropdownMenuItemType, MenuItemsType } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import { BASE_SWAP_URL, EXCHANGE_URL, GITBOOK_URL } from '../../../config';

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: ( t: ContextApi['t'] ) => ConfigMenuItemsType[] = ( t ) => [
  {
    label: t( 'Farms' ),
    href: '/farms',
    icon: 'Farm',
    items: [],
  },
  {
    label: t( 'Pools' ),
    href: '/pools',
    icon: 'Pool',
    items: [],
  },
  {
    label: '',
    href: '#',
    icon: 'More',
    hideSubNav: true,
    items: [
      {
        label: t( 'Exchange' ),
        href: BASE_SWAP_URL,
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t( 'Liquidity' ),
        href: `${ EXCHANGE_URL }/#/pool`,
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t( 'Analytics' ),
        href: 'https://info.icecreamswap.finance/',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        label: t( 'Docs' ),
        href: GITBOOK_URL,
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    ],
  },
]

export default config
