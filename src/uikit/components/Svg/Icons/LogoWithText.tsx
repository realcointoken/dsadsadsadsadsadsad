import React from 'react';
import Svg from '../Svg';
import { SvgProps } from '../types';

interface LogoProps extends SvgProps {
    isDark: boolean;
}

const Logo: React.FC<LogoProps> = ( props ) => {
    return (
        <Svg viewBox="0 0 845 188" { ...props }>
            <image href="/images/logo/logo-horizontal.svg"/>
        </Svg>
    );
};

export default React.memo( Logo, ( prev, next ) => prev.isDark === next.isDark );
