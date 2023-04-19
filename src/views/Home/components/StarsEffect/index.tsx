import React from 'react';
import styled from 'styled-components';
import './stars-effect.css';

const OuterWedgeWrapper = styled.div`
  z-index: -2;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0px;
  top: 0px;
`;

interface StarsEffectProps {
    isDark?: boolean
}

const StarsEffect: React.FC<StarsEffectProps> = ( props ) => {
    const { isDark } = props;

    const classNameAttr = isDark ? 'night' : 'day';

    return (
        <OuterWedgeWrapper>
            <div id="stars" className={ classNameAttr }/>
            <div id="stars2" className={ classNameAttr }/>
            <div id="stars3" className={ classNameAttr }/>
        </OuterWedgeWrapper>
    );
};

export default StarsEffect;