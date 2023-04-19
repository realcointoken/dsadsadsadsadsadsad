import { HTMLAttributes } from 'react'
import { BackgroundProps, BorderProps, FlexboxProps, GridProps as _GridProps, LayoutProps, PositionProps, SpaceProps } from 'styled-system'

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement> {
}

export interface FlexProps extends BoxProps, FlexboxProps {
}

export interface GridProps extends FlexProps, _GridProps {
}
