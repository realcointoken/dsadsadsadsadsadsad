import { ReactNode } from 'react'
import { Padding, Placement } from '@popperjs/core'

export interface MenuOptions {
  placement?: Placement;
  offset?: [ number, number ];
  padding?: Padding;
}

export interface BaseMenuProps {
  component: ReactNode;
  options?: MenuOptions;
  isOpen?: boolean;
}
