import React from 'react';
import { Flex, Heading, OpenNewIcon, Text, useMatchBreakpoints } from 'uikit';
import styled from 'styled-components';
import getExternalLinkProps from 'uikit/util/getExternalLinkProps';

export interface StatCardContentProps {
    headingText: string
    bodyText: string
    highlightColor: string
    footerLinkText?: string
    footerLinkUrl?: string
}

const LinkWrapper = styled.a`
    line-height: 16px;
    &:hover {
        text-decoration: underline;
    }
`;

const StatCardContent: React.FC<StatCardContentProps> = ( {
                                                              headingText,
                                                              bodyText,
                                                              highlightColor,
                                                              footerLinkText,
                                                              footerLinkUrl,
                                                          } ) => {
    const { isMobile, isTablet } = useMatchBreakpoints();
    const isSmallerScreen = isMobile || isTablet;
    const split = headingText.split( ' ' );
    const lastWord = split.pop();
    const remainingWords = split.slice( 0, split.length ).join( ' ' );

    return (
        <Flex
            minHeight={ [ null, null, null, '168px' ] }
            minWidth="232px"
            width="fit-content"
            flexDirection="column"
            justifyContent="flex-end"
            mt={ [ null, null, null, '64px' ] }
        >
            { isSmallerScreen && remainingWords.length > 13 ? (
                <Heading scale="lg">{ remainingWords }</Heading>
            ) : (
                <Heading scale="xl">{ remainingWords }</Heading>
            ) }
            <Heading color={ highlightColor } scale="xl" mb="24px">
                { lastWord }
            </Heading>
            <Text color="textSubtle">
                { bodyText }
                { footerLinkText && footerLinkUrl && (
                    <LinkWrapper href={ footerLinkUrl } { ...getExternalLinkProps() }>
                        { footerLinkText } <OpenNewIcon width={10} />
                    </LinkWrapper>
                ) }
            </Text>
        </Flex>
    );
};

export default StatCardContent;
