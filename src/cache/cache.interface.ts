export interface cacheInterface {
    getClient: () => any;
    setKey(key: string, value: string, mode?: string, duration?: number): void;
    getKey(key: string): Promise<string | null>;
    generateTTLKey(prefix: string, args: any): string;
    generateCacheKey(prefix: string, args: any): string;
    keyExists(key: string): Promise<boolean>;
    getCachedDataIfExist(source: string,  args: any): Promise<string | null>;
}