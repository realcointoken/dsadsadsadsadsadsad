import React, { lazy } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { ResetCSS } from 'uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import useScrollOnRouteChange from 'hooks/useScrollOnRouteChange'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import history from './routerHistory'
// Views included in the main bundle
import Pools from './views/Pools'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy( () => import('./views/Home') )
const Farms = lazy( () => import('./views/Farms') )
const NFTs = lazy( () => import('./views/NFTs') )
const DAO = lazy( () => import('./views/DAO') )
const NotFound = lazy( () => import('./views/NotFound') )

// This config is required for number formatting
BigNumber.config( {
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
} )

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  usePollCoreFarmData()
  useScrollOnRouteChange()
  useUserAgent()

  return (
    <Router history={ history }>
      <ResetCSS/>
      <GlobalStyle/>
      <Menu>
        <SuspenseWithChunkError fallback={ <PageLoader/> }>
          <Switch>
            <Route path="/" exact>
              <Home/>
            </Route>
            <Route path="/farms">
              <Farms/>
            </Route>
            <Route path="/pools">
              <Pools/>
            </Route>
            <Route path="/nfts">
              <NFTs/>
            </Route>
            <Route path="/dao">
              <DAO/>
            </Route>

            {/* Redirect */ }
            <Route path="/staking">
              <Redirect to="/pools"/>
            </Route>

            {/* 404 */ }
            <Route component={ NotFound }/>
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <ToastListener/>
    </Router>
  )
}

export default React.memo( App )
