import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = ( props ) => {
  return (
    <Svg viewBox="0 0 525 525" { ...props }>
      <image href="/images/logo/logotype.svg"/>
    </Svg>
  )
}

export default Icon
