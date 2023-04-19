import React from 'react';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { Flex, LinkExternal, Skeleton, Text } from 'uikit';
import { FeesProps } from 'state/types';
import FeesCard from './FeesCard';
import Divider from '../Divider';

export interface ExpandableSectionProps {
    bscScanAddress?: string
    infoAddress?: string
    removed?: boolean
    totalValueFormatted?: string
    lpLabel?: string
    addLiquidityUrl?: string
    fees?: FeesProps
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const LinksWrapper = styled.div`
  margin-top: 1rem;
`

const StyledLinkExternal = styled( LinkExternal )`
  font-weight: 400;
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ( {
                                                               bscScanAddress,
                                                               infoAddress,
                                                               removed,
                                                               totalValueFormatted,
                                                               lpLabel,
                                                               addLiquidityUrl,
                                                               fees,
                                                           } ) => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Flex justifyContent="space-between">
                <Text small>{ t( 'Total Liquidity' ) }:</Text>
                { totalValueFormatted ? <Text small>{ totalValueFormatted }</Text> : <Skeleton width={ 75 } height={ 25 }/> }
            </Flex>
            <Divider/>
            <FeesCard fees={ fees }/>
            <Divider/>
            <LinksWrapper>
                { !removed && (
                    <Flex mb="2px" justifyContent="flex-end">
                        <StyledLinkExternal href={ addLiquidityUrl } small>
                            { t( 'Get %symbol%', { symbol: lpLabel } ) }
                        </StyledLinkExternal>
                    </Flex>
                ) }

                <Flex mb="2px" justifyContent="flex-end">
                    <StyledLinkExternal href={ bscScanAddress } small>
                        { t( 'View Contract' ) }
                    </StyledLinkExternal>
                </Flex>

                <Flex mb="2px" justifyContent="flex-end">
                    <StyledLinkExternal href={ infoAddress } small>
                        { t( 'See Pair Info' ) }
                    </StyledLinkExternal>
                </Flex>
            </LinksWrapper>

        </Wrapper>
    );
};

export default DetailsSection;
