import React from 'react';
import { Alert, Flex, Heading } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import Page from 'components/Layout/Page';
import PageHeader from 'components/PageHeader';

const DAO: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader>
                <Flex justifyContent="space-between" flexDirection={ [ 'column', null, null, 'row' ] }>
                    <Flex flex="1" flexDirection="column" mr={ [ '8px', 0 ] }>
                        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
                            { t( 'DAO' ) }
                        </Heading>
                        <Heading scale="lg" color="text">
                            { t( 'Coming soon.' ) }
                        </Heading>
                    </Flex>
                </Flex>
            </PageHeader>
            <Page>
                <Alert title="" variant="info">
                    { t( 'Introducing DAO and giving control to the masses. Adding context to decentralization. Publish, vote and pass proposals. Now, you are truly in control.' ) }
                </Alert>
            </Page>
        </>
    );
};

export default DAO;
