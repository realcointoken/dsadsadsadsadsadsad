import React from 'react'
import { Alert, Flex, Heading } from 'uikit';
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'

const NFTs: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={ [ 'column', null, null, 'row' ] }>
          <Flex flex="1" flexDirection="column" mr={ [ '8px', 0 ] }>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              { t( 'NFTs' ) }
            </Heading>
            <Heading scale="lg" color="text">
              { t( 'Coming soon.' ) }
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Alert title="" variant="info">
          { t( 'With Partnership and possible cross chain listing, NFTs have never been soo promising. Follow our socials for further updates.' ) }
        </Alert>
      </Page>
    </>
  )
}

export default NFTs
