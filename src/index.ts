import { AnkrConfig, AnkrMultiChainProvider, AnkrSolanaDevNetProvider, AnkrSolanaMainNetProvider } from "./ankr";
import { BaseMainNetProvider, BaseSepoliaProvider } from "./base";
import { EthereumMainNetProvider, EthereumSepoliaProvider, EthereumTestNetProvider } from "./ethereum";
import { ProviderBase, providerInterface } from "./provider";
import { ProviderConfig } from "./provider/types";

export { 
  ProviderConfig,
  ProviderBase,
  providerInterface,

  AnkrConfig,
  AnkrMultiChainProvider,
  AnkrSolanaMainNetProvider,
  AnkrSolanaDevNetProvider,

  BaseMainNetProvider,
  BaseSepoliaProvider,

  EthereumMainNetProvider,
  EthereumSepoliaProvider,
  EthereumTestNetProvider,
};

export function getProvider(blockchain: string, network: string, config: ProviderConfig): ProviderBase | undefined {

  if (blockchain === 'ethereum') {
    switch (network) {
      case 'mainnet':
        return new EthereumMainNetProvider(config);
      case 'sepolia':
        return new EthereumSepoliaProvider(config);
      case 'testnet':
        return new EthereumTestNetProvider(config);
      default:
        throw new Error('Invalid network');
    }
  } else if(blockchain === 'solana') {
    switch (network) {
      case 'mainnet':
        return new AnkrSolanaMainNetProvider(config);
      case 'devnet':
        return new AnkrSolanaDevNetProvider(config);
      default:
        throw new Error('Invalid network');
    }
  } else if(blockchain === 'bsc'){
    switch (network) {
      case 'mainnet':
        return new AnkrSolanaMainNetProvider(config);
      case 'testnet':
        return new AnkrSolanaDevNetProvider(config);
      default:
        throw new Error('Invalid network');
    }

  }else if (blockchain === 'base'){
    switch (network) {
      case 'mainnet':
        return new BaseMainNetProvider(config);
      case 'sepolia':
        return new BaseSepoliaProvider(config);
      default:
        throw new Error('Invalid network');
    }
  }
  
}