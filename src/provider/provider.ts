import axios, { AxiosError, AxiosResponse } from "axios";
import { EndpointStatus, ProviderConfig, SeverityLevel } from "./types";
import { providerInterface } from "./provider.interface";
import RpcEngine, { createAsyncMiddleware, JsonRpcEngine, JsonRpcFailure, JsonRpcRequest, JsonRpcResponse, JsonRpcSuccess } from 'json-rpc-engine';
import { CacheManager } from "../cache/cache";
import { ANKR_API_UPDATE_INTERVAL } from "../ankr/cacheConfig";

export abstract class ProviderBase implements providerInterface {

    readonly allowStaleOnFailure: boolean;
    readonly isCacheEnabled: boolean = false;
    readonly cacheAbleMethods: string[] = [];
    readonly engine: RpcEngine.JsonRpcEngine;
    protected requestIdCounter: number = 1;
    protected url: string = "";
    protected cacheManager : CacheManager | undefined;
    protected source: string = ProviderBase.name;
    protected config: ProviderConfig;
    static sendErrorToSentry: (err: Error, tags: Record<string, string> , level: SeverityLevel) => void;

    // retry logic properties
    protected endpoints: EndpointStatus[] = [];
    protected currentEndpointIndex: number = 0;
    private readonly MAX_RETRIES: number = 3;
    private readonly RETRY_DELAY: number = 1000;
    private readonly UNHEALTHY_THRESHOLD: number = 5; // Mark unhealthy after N failures
    private readonly HEALTH_CHECK_INTERVAL: number = 300000; // 300 seconds or 5 minutes

    constructor(providerConfig: ProviderConfig) {
        this.config = providerConfig;
        // Bind methods to the class instance
        this.createAsyncRequestMiddleware = this.createAsyncRequestMiddleware.bind(this);
        this.sendAsync = this.sendAsync.bind(this);
        this.fetch = this.fetch.bind(this);
        this.allowStaleOnFailure = providerConfig.allowStaleOnFailure;
        this.isCacheEnabled = providerConfig.isCacheEnabled;
        this.cacheAbleMethods = providerConfig.cacheAbleMethods;
        ProviderBase.sendErrorToSentry = providerConfig.sendErrorToSentry;
        this.engine = new JsonRpcEngine();
        if(this.isCacheEnabled){
            this.engine.push(this.cacheMiddleware());
            this.cacheManager = new CacheManager(providerConfig.getRedisClient);
        }
        this.engine.push(this.createAsyncRequestMiddleware());

        this.endpoints = this.config.endpoints.map(endpoint => ({
            ...endpoint,
            healthy: true,
            lastUsed: Date.now(),
            retryCount: 0,
            healthCheck: endpoint.healthCheck
        }));
        // Start periodic health checks
        setInterval(() => this.checkEndpointHealth(), this.HEALTH_CHECK_INTERVAL);
    }

    async sendAsync(request: JsonRpcRequest<any>): Promise<JsonRpcResponse<any>> {
        request.id = this.requestIdCounter++;
        request.jsonrpc = "2.0";
        return await this.engine.handle(request);
    }

    cacheMiddleware(){
        return createAsyncMiddleware(async (req, res, next) => {
            if(!this.cacheAbleMethods.includes("*") && !this.cacheAbleMethods.includes(req.method)){
                next();
            }else{
                const key = `${this.source}:${req.method}:${JSON.stringify(req.params)}`;
                const data = await this.cacheManager?.getCachedDataIfExist(key);
                if(data){
                    res.result = data;
                }else{
                    await next();
                    if(!res.result && this.allowStaleOnFailure){
                        const staleData = await this.cacheManager?.getKey(key);
                        if(!staleData){
                            const err = new Error(`Send Stale Data for key: ${key}`);
                            res.result = staleData;
                            console.warn(`Send Stale Data for key: ${key}`);
                            ProviderBase.Sentry(err, {"Veera-Middleware": this.source}, "warning");
                        }else{
                            const err = new Error(`${res.error?.message} | and Stale Data not found for key: ${key}`);
                            err.stack = res.error?.stack;
                            res.error = {
                                code: -32000,
                                message:  err.message,
                                data: {
                                    message: err.message,
                                    stack: err.stack
                                }
                            }
                            console.error(`${res.error?.message} | and Stale Data not found for key: ${key}`);
                            ProviderBase.Sentry(err, {"Veera-Middleware": this.source}, "error");
                        }
                    }else if(res.result){
                        const ttl :number | undefined =  ANKR_API_UPDATE_INTERVAL[req.method as keyof typeof ANKR_API_UPDATE_INTERVAL] || 30;
                        this.cacheManager?.setCacheData(key,res.result, ttl);
                    }
                }
            }
          });
    }

    createAsyncRequestMiddleware(){
        return createAsyncMiddleware(async (req, res, next) => {
            try {
                const response = await this.fetch(req);
                res.result = response;
            } catch (error:any) {
                res.result = null;
                ProviderBase.Sentry(error, {"Veera-Middleware": this.source}, "error");
            }
          });
    }

    async fetch(request: JsonRpcRequest<any>): Promise<any> {
      let lastError: Error | undefined;
      const totalEndpoints = this.endpoints.length;

      for (let retry = 0; retry < this.MAX_RETRIES; retry++) {
          for (let i = 0; i < totalEndpoints; i++) {
              const endpointIndex = (this.currentEndpointIndex + i) % totalEndpoints;
              const endpoint = this.endpoints[endpointIndex];
              if (!endpoint.healthy) continue;

              try {
                  const response = await axios.post(endpoint.url, request, {
                      headers: { 'Content-Type': 'application/json' },
                      timeout: endpoint.timeout || 10000
                  });

                  if (this.isResponseValid(response)) {
                      endpoint.retryCount = 0;
                      this.currentEndpointIndex = endpointIndex;
                      return response.data;
                  } else {
                      throw new Error(`Invalid response from ${endpoint.maskedUrl}`);
                  }
              } catch (error) {
                  lastError = error as Error;
                  this.handleEndpointError(endpoint, error);
                  if (!this.shouldRetry(error)) break;
              }
          }
          await this.delay(this.RETRY_DELAY * (2 ** retry));
      }

      // Final attempt ignoring health status
      for (const endpoint of this.endpoints) {
          try {
              const response = await axios.post(endpoint.url, request, {
                  headers: { 'Content-Type': 'application/json' },
                  timeout: endpoint.timeout || 10000
              });
              if (this.isResponseValid(response)) return response.data;
          } catch (error) {
              lastError = error as Error;
          }
      }

      throw lastError || new Error("All endpoints failed after retries");
  }

    static Sentry(err: Error, tags: Record<string, string>, level: SeverityLevel) {
        try {
            if(ProviderBase.sendErrorToSentry !== undefined){
                ProviderBase.sendErrorToSentry(err, tags, level);
            }
        } catch (error) {
            console.error("Error sending error to Sentry From Veera-Middleware:", error);
        }
    }

    private getNextEndpoint(): EndpointStatus | undefined {
        let attempts = 0;
        while (attempts++ < this.endpoints.length) {
          this.currentEndpointIndex = 
            (this.currentEndpointIndex + 1) % this.endpoints.length;
          const endpoint = this.endpoints[this.currentEndpointIndex];
          
          if (endpoint.healthy) {
            endpoint.lastUsed = Date.now();
            return endpoint;
          }
        }
        return undefined;
    }

    private async checkEndpointHealth(): Promise<void> {
        for (const endpoint of this.endpoints) {
          try {
            const response = await axios.post(endpoint.url, {
              jsonrpc: '2.0',
              id: 1,
              method: endpoint.healthCheck?.method || 'eth_blockNumber',
              params: endpoint.healthCheck?.params || []
            }, { timeout: 5000 });

            if (!response.data.result) {
                console.error(`Invalid health check response from ${endpoint.maskedUrl} : ${endpoint.healthCheck.method} - ${JSON.stringify(response.data)}`);
            }else{
                console.log(`Health check response from ${endpoint.maskedUrl} : ${endpoint.healthCheck.method} - ${response.data.result}`);
            }
    
            const currentBlock = parseInt(response.data.result);
            endpoint.blockHeight = currentBlock;
            
            if (!endpoint.healthy) {
              console.log(`Endpoint ${endpoint.maskedUrl} recovered`);
              endpoint.healthy = true;
              endpoint.retryCount = 0;
            }
          } catch (error) {
            if (endpoint.healthy) {
              console.warn(`Marking endpoint ${endpoint.maskedUrl} as unhealthy : ${error}`);
              endpoint.healthy = false;
            }
            this.handleEndpointError(endpoint, error);
          }
        }
    }

    private async handleEndpointError(endpoint: EndpointStatus, error: any): Promise<void> {
        endpoint.retryCount++;
        const tags = {
            "Veera-Middleware": this.source,
            endpoint: endpoint.maskedUrl
        };

        if (endpoint.retryCount >= this.UNHEALTHY_THRESHOLD) {
            endpoint.healthy = false;
            const err = new Error(`Endpoint marked unhealthy: ${endpoint.maskedUrl}`);
            ProviderBase.Sentry(err, tags, "error");
            // Todo: Send Slack alert here
        } else {
            ProviderBase.Sentry(error, tags, "warning");
        }
    }

    private isResponseValid(response: AxiosResponse): boolean {
        if (response.status < 200 || response.status >= 300) return false;
        if (response.data.error) return false;
        
        // Add chain-specific validation if needed
        return true;
    }
    
    private shouldRetry(error: unknown): boolean {
        if (!axios.isAxiosError(error)) return true;
        const status = error.response?.status;
        return status === undefined || status >= 500 || status === 429 || status === 408;
    }
    
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}