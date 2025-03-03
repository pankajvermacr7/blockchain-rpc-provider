import { AnkrConfig } from "../ankr/type";
import { InfuraConfig } from "../ethereum/type";

export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
export type ProviderConfig = {
    getRedisClient: () => any;
    sendErrorToSentry: (err: Error, tags: Record<string, string> , level: SeverityLevel) => void;
    allowStaleOnFailure: boolean;
    requestIdCounter: number;
    isCacheEnabled: boolean;
    cacheAbleMethods: string[];
    ankrConfig: AnkrConfig;
    infuraConfig: InfuraConfig;
    endpoints: EndpointStatus[];
    rpcEndpoints: Record<string, Record<string, RpcEndpoint[]>>;
    
}

// New interface for endpoint health tracking
export interface EndpointStatus extends RpcEndpoint {
    healthy: boolean;
    lastUsed: number;
    retryCount: number;
    blockHeight?: number;
}

export interface RpcEndpoint {
    url: string;
    maskedUrl: string;
    timeout?: number;
}

export const getEndpoints = (blockchain: string, network: string, config: ProviderConfig): EndpointStatus[] => {
    // Check if the blockchain exists
    if (!config.rpcEndpoints[blockchain]) {
      throw new Error(`Unsupported blockchain: ${blockchain}`);
    }
    
    // Check if the network exists for the given blockchain
    if (!config.rpcEndpoints[blockchain][network]) {
      throw new Error(`Unsupported network "${network}" for blockchain "${blockchain}"`);
    }
    
    const endpointInfoArray = config.rpcEndpoints[blockchain][network];
    
    // Create endpoints from all available URLs for this network
    config.endpoints = endpointInfoArray.map(endpointInfo => ({
      healthy: true,
      lastUsed: 0,
      retryCount: 0,
      url: endpointInfo.url,
      maskedUrl: endpointInfo.maskedUrl,
      timeout: 10000
    }));
    
    return config.endpoints;
  };