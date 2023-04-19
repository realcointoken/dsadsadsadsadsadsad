import { ChainId } from '@pancakeswap/sdk';
import BigNumber from 'bignumber.js/bignumber';
import { BIG_TEN } from 'utils/bigNumber';

BigNumber.config( {
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
} );

/**
 * GLOBAL FARMS PIDS
 */
export const FARM_VANI_WBNB_PID = 1;
export const FARM_BUSD_WBNB_PID = 3;

/**
 * TOKEN/BLOCK DETAILS
 */
export const BSC_BLOCK_TIME = 3;

export const CAKE_PER_BLOCK = 1;
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365; // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR;

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow( 18 );

/**
 * TRANSACTIONS
 */
export const DEFAULT_GAS_LIMIT = 300_000;

/**
 * URLS
 */
export const BASE_URL = 'https://app.icecreamswap.finance';
export const GITBOOK_URL = `${BASE_URL}/IEvolution.pdf`;
export const PCS_URL = 'https://pancakeswap.finance';

export const EXCHANGE_URL = 'https://swap.icecreamswap.finance';
export const BASE_ADD_LIQUIDITY_URL = `${ EXCHANGE_URL }/#/add`;
export const BASE_SWAP_URL = `${ EXCHANGE_URL }/#/swap`;

export const BASE_BSC_SCAN_URLS = {
    [ChainId.MAINNET]: 'https://bscscan.com',
    [ChainId.TESTNET]: 'https://testnet.bscscan.com',
};
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET];