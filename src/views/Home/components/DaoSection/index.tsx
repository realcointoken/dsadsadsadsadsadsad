import React from 'react';
import { Button, Flex, Link, Text } from 'uikit';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { GITBOOK_URL } from 'config';
import ColoredWordHeading from '../ColoredWordHeading';

const DescriptionWrapper = styled( Flex )`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    text-shadow: #000000cc 0px 0 7px;
    
    ${ ( { theme } ) => theme.mediaQueries.md } {
        width: 50%;
        margin-left: 50%;
        align-items: flex-start;
        margin-left: 50%;
        text-shadow: #00000033 0px 0 4px;
        text-align: left;
    }
`;

const DaoSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <DescriptionWrapper minHeight={ 380 }>
            <ColoredWordHeading text={ t( 'DAO.' ) }/>
            <Text color="textSubtle" mb="24px" style={ { whiteSpace: 'pre-wrap' } }>
                { t( 'Community engagement has never had a better place. VANI for association.\nDecisiveness is for the decentralized.' ) }
            </Text>
            <Flex>
                <Button mr="16px">
                    <RouterLink to='/dao'>
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
    );
};

export default DaoSection;
