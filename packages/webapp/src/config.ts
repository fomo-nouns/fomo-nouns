import { ChainId } from '@usedapp/core';
import {providers, getDefaultProvider} from 'ethers';

export const LOCAL_CHAIN_ID = 31337;
type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | typeof LOCAL_CHAIN_ID;

/** Select the Chain to Use */
export const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME!;
export const PROVIDER_NAME = process.env.REACT_APP_PROVIDER_NAME!;
export const FOMO_WEBSOCKET = process.env.REACT_APP_WEB_SOCKET!;
export const PROVIDER_KEY = process.env.REACT_APP_PROVIDER_KEY!;
export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY!;
/*--------------------------*/

// TODO: Clean this up
export const CHAIN_ID: SupportedChains =
    CHAIN_NAME === 'rinkeby' ? ChainId.Rinkeby
  : CHAIN_NAME === 'mainnet' ? ChainId.Mainnet
  : CHAIN_NAME === 'local' ? LOCAL_CHAIN_ID : -1;

const createProviderURL = (chainName: string) => {
  if (PROVIDER_NAME === 'alchemy') return `eth-${chainName}.alchemyapi.io/v2/${PROVIDER_KEY}`;
  else return `${chainName}.infura.io/v3/${PROVIDER_KEY}`;
}


interface Config {
  chainName: string;
  chainId: number;
  auctionProxyAddress: string;
  nounsDescriptor: string;
  nounsSeeder: string;
  tokenAddress: string;
  nounsDaoProxyAddress: string;
  nounsDaoExecutorAddress: string;
  jsonRpcUri: string;
  wsRpcUri: string;
  enableHistory: boolean;
}

const config: Record<SupportedChains, Config> = {
  [ChainId.Rinkeby]: {
    chainName: 'rinkeby',
    chainId: ChainId.Rinkeby,    
    jsonRpcUri: `https://${createProviderURL('rinkeby')}`,
    wsRpcUri: `wss://${createProviderURL('rinkeby')}`,
    auctionProxyAddress: '0x7cb0384b923280269b3BD85f0a7fEaB776588382',
    nounsDescriptor: '0x53cB482c73655D2287AE3282AD1395F82e6a402F',
    nounsSeeder : '0xA98A1b1Cc4f5746A753167BAf8e0C26AcBe42F2E',
    tokenAddress: '0x632f34c3aee991b10D4b421Bc05413a03d7a37eB',
    nounsDaoProxyAddress: '0xd1C753D9A23eb5c57e0d023e993B9bd4F5086b04',
    nounsDaoExecutorAddress: '0xd1C753D9A23eb5c57e0d023e993B9bd4F5086b04',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true' || false,
  },
  [ChainId.Mainnet]: {
    chainName: 'mainnet',
    chainId: ChainId.Mainnet,
    auctionProxyAddress: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    nounsDescriptor: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
    nounsSeeder: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
    tokenAddress: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    nounsDaoProxyAddress: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
    nounsDaoExecutorAddress: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    jsonRpcUri: `https://${createProviderURL('mainnet')}`,
    wsRpcUri: `wss://${createProviderURL('mainnet')}`,
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true' || false,
  },
  [LOCAL_CHAIN_ID]: {
    chainName: 'local',
    chainId: LOCAL_CHAIN_ID,
    auctionProxyAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    tokenAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    // Temporarily set this to _any_ address until local deployment is configured
    nounsDescriptor: '0x53cB482c73655D2287AE3282AD1395F82e6a402F',
    nounsSeeder: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',    
    nounsDaoExecutorAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    nounsDaoProxyAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    jsonRpcUri: 'http://localhost:8545',
    enableHistory: false,
    wsRpcUri: 'ws://localhost:8545',
  },
};

export default config[CHAIN_ID];

export const provider: providers.BaseProvider = getDefaultProvider(config[CHAIN_ID].jsonRpcUri);