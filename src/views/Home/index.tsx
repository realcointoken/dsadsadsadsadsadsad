import React from 'react';
import PageSection from 'components/PageSection';
import useTheme from 'hooks/useTheme';
import { PageMeta } from 'components/Layout/Page';
import MetricsSection from './components/MetricsSection';
import StarsEffect from './components/StarsEffect';
import NftsSection from './components/NftsSection';
import DaoSection from './components/DaoSection';
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopLeft } from './components/WedgeSvgs';

const Home: React.FC = () => {
    const { theme } = useTheme();

    const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' };

    return (
        <>
            <PageMeta/>
            <PageSection
                innerProps={ { style: { margin: '0', width: '100%' } } }
                backgroundColor={
                    theme.isDark
                        ? 'linear-gradient(180deg, #590059 22%, #280028 100%)'
                        : 'linear-gradient(180deg, #c76ec9 22%, #8b0a8b 100%)'
                }
                index={ 2 }
                hasCurvedDivider={ false }
            >
                <MetricsSection/>
            </PageSection>

            <PageSection
                innerProps={ { style: { ...HomeSectionContainerStyles, overflow: 'hidden' } } }
                backgroundImage='radial-gradient(ellipse at bottom, #301236 0%, #090a0f 100%);'
                borderBottom='1px solid #ffffff11'
                index={ 2 }
                hasCurvedDivider={ false }
            >
                <OuterWedgeWrapper>
                    <InnerWedgeWrapper top fill={ theme.isDark ? '#280028' : '#8b0a8b' }>
                        <WedgeTopLeft/>
                    </InnerWedgeWrapper>
                </OuterWedgeWrapper>
                <StarsEffect isDark={ theme.isDark }/>
                <NftsSection/>
            </PageSection>

            <PageSection
                innerProps={ { style: HomeSectionContainerStyles } }
                backgroundImage={ theme.isDark ? '/images/home/dao/background.png' : '/images/home/dao/background-light.png' }
                backgroundColor={ theme.isDark ? '#000000' : '#FFC7FF' }
                borderBottom='6px solid black'
                index={ 3 }
                hasCurvedDivider={ false }
            >
                <DaoSection/>
            </PageSection>
        </>
    );
};

export default Home;
