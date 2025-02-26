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
}