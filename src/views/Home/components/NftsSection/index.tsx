import React from 'react';
import { Button, Flex, Link, Text } from 'uikit';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { GITBOOK_URL } from 'config';
import ColoredWordHeading from '../ColoredWordHeading';

const DescriptionWrapper = styled( Flex )`
    width: 100%;
    margin-top: 2rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    
    ${ ( { theme } ) => theme.mediaQueries.md } {
        text-align: left;
        margin-top: 0;
    }
`;

const ImagesWrapper = styled( Flex )`
    position: relative;
    width: 50%;
    margin: 2rem auto;
    
    ${ ( { theme } ) => theme.mediaQueries.md } {
        margin: 0 0 0 3rem;
    }
`;

const NftsSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Flex
            flexDirection={ [ 'column-reverse', null, null, 'row' ] }
            alignItems={ [ 'flex-end', null, null, 'center' ] }
            justifyContent="center"
            minHeight={ 500 }
        >
            <DescriptionWrapper
                flexDirection="column"
                flex="1"
                ml={ [ null, null, null, null ] }
                mr={ [ null, null, null, '64px' ] }
                alignSelf={ [ 'flex-start', null, null, 'center' ] }
            >
                <ColoredWordHeading text={ t( 'NFT\'s Reimagined.' ) }/>
                <Text color="textSubtle" mb="24px" style={ { whiteSpace: 'pre-wrap' } }>
                    { t( 'Unique design incorporating the best amongst the blockchain universe and in Development' ) }
                </Text>
                <Flex>
                    <Button mr="16px">
                        <RouterLink to='/nfts'>
                            <Text color="card" bold fontSize="16px">
                                { t( 'Check out' ) }
                            </Text>
                        </RouterLink>
                    </Button>
                    <Link external href={ GITBOOK_URL }>
                        { t( 'Learn' ) }
                    </Link>
                </Flex>
            </DescriptionWrapper>
            <ImagesWrapper>
                <img src='/images/home/nfts/shop.png' alt='Shop'/>
                <img src='/images/home/nfts/coin.gif' alt='Coin' style={ { position: 'absolute', top: 27, left: -24 } }/>
            </ImagesWrapper>
        </Flex>
    );
};

export default NftsSection;
