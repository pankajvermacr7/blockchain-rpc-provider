export type providerConfig = {
    getRedisClient: () => any;
    allowStaleOnFailure: boolean;
    requestIdCounter: number;
    isCacheEnabled: boolean;
    cacheAbleMethods: string[];
}