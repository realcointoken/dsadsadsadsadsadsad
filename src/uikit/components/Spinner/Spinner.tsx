import React from 'react'
import styled, { keyframes } from 'styled-components'
import { SpinnerProps } from './types'
import { PancakeRoundIcon, Svg, SvgProps } from '../Svg'

const ShadowIcon: React.FC<SvgProps> = ( props ) => {
  return (
    <Svg viewBox="0 0 96 96" { ...props }>
      <ellipse cx="48" cy="48" rx="48" ry="10" fill='#666666aa' />
    </Svg>
  )
}

const floatAnimation = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`

const shadowAnimation = keyframes`
	0% {
	  transform: scaleX(.8);
	}
	50% {
	  transform: scaleX(1);
	}
	100% {
	  transform: scaleX(.8);
	}
`

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const FloatingLogoIcon = styled( PancakeRoundIcon )`
  animation: ${ floatAnimation } 3s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`

const FloatingShadowIcon = styled( ShadowIcon )`
  animation: ${ shadowAnimation } 3s ease-in-out infinite;
`

const Spinner: React.FC<SpinnerProps> = ( { size = 128 } ) => {
  return (
    <Container>
      <FloatingLogoIcon width={ `${ size }px` }/>
      <FloatingShadowIcon width={ `${ size * 0.8 }px` }/>
    </Container>
  )
}

export default Spinner
