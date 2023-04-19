import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'IceCream',
  description:
    'The most popular AMM on BSC! Earn VANI through yield farming, then stake it in Pools to earn more tokens!',
  image: 'https://app.icecreamswap.finance/images/logo/logo-square.png',
}

export const getCustomMeta = ( path: string, t: ContextApi['t'] ): PageMeta => {
  switch ( path ) {
    case '/':
      return {
        title: `${ t( 'Home' ) } | ${ t( 'IceCream' ) }`,
      }
    case '/farms':
      return {
        title: `${ t( 'Farms' ) } | ${ t( 'IceCream' ) }`,
      }
    case '/pools':
      return {
        title: `${ t( 'Pools' ) } | ${ t( 'IceCream' ) }`,
      }
    default:
      return null
  }
}
