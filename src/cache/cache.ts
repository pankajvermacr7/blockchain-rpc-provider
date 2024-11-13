import { ProviderBase } from "../provider";
import { cacheInterface } from "./cache.interface";

export class CacheManager implements cacheInterface {

    protected allowStaleOnFailure : boolean = false;

    getClient: any;

    constructor(getRedisClient: any, allowStaleOnFailure: boolean = false) {
      this.getClient = getRedisClient;
      this.getClient = this.getClient.bind(this);
      this.allowStaleOnFailure = allowStaleOnFailure;
    }

    async keyExists(key: string): Promise<boolean> {
      try {
        const client = await this.getClient();
        if (!client) {
          throw new Error("Redis client not available.");
        }
        const exists = await client.exists(key);
        return exists? true : false;
      } catch (error:any) {
        ProviderBase.Sentry(error, { "Veera-Middleware": CacheManager.name }, "error");
        return false;
      }
        
    }

    generateTTLKey(prefix: string, args: any): string {
      const serializedArgs = JSON.stringify(args);
      return `${prefix}:TTL:${serializedArgs}`;
    }
    
    generateCacheKey(prefix: string, args: any): string {
      const serializedArgs = JSON.stringify(args);
      return `${prefix}:${serializedArgs}`;
    }

    setKey = async (key: string, value: any, mode?: string, duration?: number) => {
      try {
        const data = JSON.stringify(value);
        const client = await this.getClient();
        if (!client) {
          throw new Error("Redis client not available.");
        }
        if (mode && duration) {
          client.set(key, data, { [mode]: duration });
        } else {
          client.set(key, data);
        }
      } catch (error : any) {
        ProviderBase.Sentry(error, { "Veera-Middleware": CacheManager.name }, "error");
      }
    };  
      
    getKey = async (key: string): Promise<any> => {
        try {
          const client = await this.getClient();
          if (!client) {
            throw new Error("Redis client not available.");
          }
          const value = await client.get(key);
          return value ? JSON.parse(value) : null;
        } catch (err:any) {
          ProviderBase.Sentry(err, { "Veera-Middleware": CacheManager.name }, "error");
          return null;
        }
      };
    
    getCachedDataIfExist = async (key: string): Promise<any> => {
      const ttlKey = `TTL:${key}`;
      const exists = await this.keyExists(ttlKey);
      if (exists) {
        const data = await this.getKey(key);
        return data;
      }
      return null;
    };

    setCacheData = async (key:string, value:any, ttl?: number): Promise<void> => {
      const ttlKey = `TTL:${key}`;
      await this.setKey(ttlKey, true, "EX", ttl);
      await this.setKey(key, value);
    };

}