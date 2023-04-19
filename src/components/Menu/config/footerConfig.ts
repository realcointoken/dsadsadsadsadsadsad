import { FooterLinkType } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import { GITBOOK_URL } from 'config';

export const footerLinks: ( t: ContextApi['t'] ) => FooterLinkType[] = ( t ) => [
  {
    label: t( 'Help' ),
    items: [
      {
        label: t( 'Documentation' ),
        href: GITBOOK_URL,
      },
    ],
  },
  {
    label: t( 'Official links' ),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/icecreamswap',
      },
      {
        label: 'Telegram',
        href: 'https://t.me/IceCreamSwap',
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/SwapIceCream',
      },
    ],
  },
]
