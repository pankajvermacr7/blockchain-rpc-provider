import axios from "axios";
import { ProviderConfig, SeverityLevel } from "./types";
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
    }

    async sendAsync(request: JsonRpcRequest<any>): Promise<JsonRpcResponse<any>> {
        request.id = this.requestIdCounter++;
        request.jsonrpc = "2.0";
        return await this.engine.handle(request);
    }

    cacheMiddleware(){
        return createAsyncMiddleware(async (req, res, next) => {
            if(!this.cacheAbleMethods.includes(req.method)){
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
                        if(staleData){
                            const err = new Error(`Send Stale Data for key: ${key}`);
                            ProviderBase.Sentry(err, {"Veera-Middleware": this.source}, "warning");
                            delete res.error;
                            res.result = staleData;
                        }else{
                            const err = new Error(`${res.error?.message} | and Stale Data not found for key: ${key}`);
                            err.stack = res.error?.stack;
                            ProviderBase.Sentry(err, {"Veera-Middleware": this.source}, "error");
                        }
                    }else if(res.result){
                        const ttl :number | undefined =  ANKR_API_UPDATE_INTERVAL[req.method as keyof typeof ANKR_API_UPDATE_INTERVAL] || undefined;
                        this.cacheManager?.setCacheData(key,res.result, ttl);
                    }
                }
            }
          });
    }

    createAsyncRequestMiddleware(){
        return createAsyncMiddleware(async (req, res, next) => {
            try {
                const response = await this.fetch(this.url, req);
                res.result = response;
            } catch (error:any) {
                res.result = undefined;
                ProviderBase.Sentry(error, {"Veera-Middleware": this.source}, "error");
            }
          });
    }

    async fetch(url: string, request: JsonRpcRequest<any>): Promise<any> {
        try {
            const response = await axios.post(url, request, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error: any) {
            throw error;
        }
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

}