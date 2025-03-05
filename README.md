# Veera Chain Providers

A robust multi-chain RPC provider with automatic failover, health monitoring, and caching capabilities.

## Features

- **Multi-chain Support**: Ethereum, BSC, Solana, Base
- **Smart Retry Mechanism**: Automatic failover between endpoints
- **Health Monitoring**: Real-time endpoint status tracking
- **Caching Layer**: Configurable response caching with stale-while-revalidate
- **Error Reporting**: Integrated Sentry error tracking
- **Type Safety**: Full TypeScript support

## Supported Networks

| Blockchain | Networks               |
|------------|------------------------|
| Ethereum   | Mainnet, Sepolia, Testnet |
| BSC        | Mainnet, Testnet       |
| Solana     | Mainnet, Devnet        |
| Base       | Mainnet, Sepolia       |

## Installation

```bash
npm install veera-middleware
```

## Basic Usage
```typescript
import { getProvider, ProviderConfig } from 'veera-middleware';

// 1. Configure endpoints
const NETWORK_ENDPOINTS = {
  ethereum: {
    mainnet: [{
      url: `https://mainnet.infura.io/v3/INFURA_KEY`,
      maskedUrl: 'https://mainnet.infura.io/v3/****'
    }]
  }
};

// 2. Setup provider config
const providerConfig: ProviderConfig = {
    getRedisClient: () => getRedisClient(),
    sendErrorToSentry: (err, tags, level) => sendErrorToSentry(err, tags, level),
    allowStaleOnFailure: true,
    requestIdCounter: 1,
    isCacheEnabled: true,
    cacheAbleMethods: ['*'],
    ankrConfig: { API_KEY: config.ankr.apiKey },
    infuraConfig: { API_KEY: config.infuraProjectId },
    endpoints: [],
    rpcEndpoints: NETWORK_ENDPOINTS
};

// 3. Get provider and make requests
const provider = getProvider('ethereum', 'mainnet', providerConfig);
const balance = await provider.sendAsync({
  method: 'eth_getBalance',
  params: ['0x...', 'latest']
});
```

## Key Features

### Automatic Failure Handling
Retries: 3 attempts with exponential backoff

Failover: Round-robin through multiple endpoints

Health Checks: Every 30s, marks unhealthy nodes

Block Height Monitoring: Detects stale nodes

### Smart Caching
Redis-backed response caching

Stale data serving during outages

Method-specific TTLs

Cache invalidation on write operations

### Error Handling
Automatic Sentry reporting

Classified errors (network vs application)

Masked endpoint URLs in logs

Contextual error metadata

### Under the Hood

1. Retry Logic

    Round-robin between endpoints

    Exponential backoff (1s, 2s, 4s)

    Skips unhealthy nodes

2. Health Monitoring

    Continuous block height checks

    Timeout handling (5s)

    Automatic node recovery detection

3. Cache Layer

    Redis storage

    Stale-while-revalidate pattern

    Param-based cache keys

4. Supported Chains

    Ethereum (+ testnets)

    BSC

    Solana

    Base

### Basic Setup

1. Install package

2. Configure endpoints for each chain

3. Set up Redis for caching

4. Get RPC Node Provider

5. Call sendAsync method

### Example

Here's a concise README.md:

```markdown
# Veera Chain Provider

## Quick Start

### Installation
```bash
npm install veera-middleware
```

### Basic Usage
```typescript
import { getProvider } from 'veera-middleware';

// 1. Configure endpoints
const NETWORK_ENDPOINTS = {
  ethereum: {
    // list of url for eth mainnet, in case of failure
    mainnet: [
        {
            url: `https://mainnet.infura.io/v3/INFURA_KEY`,
            maskedUrl: 'https://mainnet.infura.io/v3/****'
        }
    ]
  }
};

// 2. Setup provider config
const providerConfig = {
  rpcEndpoints: NETWORK_ENDPOINTS,
  isCacheEnabled: true,
  infuraConfig: { API_KEY: 'YOUR_INFURA_KEY' }
};

// 3. Get provider and make requests
const provider = getProvider('ethereum', 'mainnet', providerConfig);
const balance = await provider.sendAsync({
  method: 'eth_getBalance',
  params: ['0x...', 'latest']
});
```

## Key Features

### Automatic Failure Handling
- **Retries**: 3 attempts with exponential backoff
- **Failover**: Round-robin through multiple endpoints
- **Health Checks**: Every 30s, marks unhealthy nodes
- **Block Height Monitoring**: Detects stale nodes

### Smart Caching
- Redis-backed response caching
- Stale data serving during outages
- Method-specific TTLs
- Cache invalidation on write operations

### Error Handling
- Automatic Sentry reporting
- Classified errors (network vs application)
- Masked endpoint URLs in logs
- Contextual error metadata

## Under the Hood

1. **Retry Logic**  
   - Round-robin between endpoints
   - Exponential backoff (1s, 2s, 4s)
   - Skips unhealthy nodes

2. **Health Monitoring**  
   - Continuous block height checks
   - Timeout handling (5s)
   - Automatic node recovery detection

3. **Cache Layer**  
   - Redis storage
   - Stale-while-revalidate pattern
   - Param-based cache keys

4. **Supported Chains**  
   - Ethereum (+ testnets)
   - BSC
   - Solana
   - Base

## Basic Setup
1. Install package
2. Configure endpoints for each chain
3. Set up Redis for caching
4. Initialize with API keys
5. Handle responses with error checking


