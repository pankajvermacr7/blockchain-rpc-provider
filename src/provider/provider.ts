import axios from "axios";
import { providerConfig } from "./types";
import { providerInterface } from "./provider.interface";
import RpcEngine, { createAsyncMiddleware, JsonRpcEngine, JsonRpcFailure, JsonRpcRequest, JsonRpcResponse, JsonRpcSuccess } from 'json-rpc-engine';

export abstract class ProviderBase implements providerInterface {
    readonly getRedisClient: () => any;
    readonly allowStaleOnFailure: boolean;
    isCacheEnabled: boolean = false;
    cacheAbleMethods: string[] = [];
    engine: RpcEngine.JsonRpcEngine;
    protected requestIdCounter: number = 1;
    protected url: string = "";

    constructor(config:providerConfig) {
        // Bind methods to the class instance
        this.createAsyncRequestMiddleware = this.createAsyncRequestMiddleware.bind(this);
        this.sendAsync = this.sendAsync.bind(this);
        this.fetch = this.fetch.bind(this);

        this.getRedisClient = config.getRedisClient;
        this.allowStaleOnFailure = config.allowStaleOnFailure;
        this.cacheAbleMethods = config.cacheAbleMethods;
        this.engine = new JsonRpcEngine();
        if(this.isCacheEnabled){
            this.engine.push(this.cacheMiddleware);
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
            next();
          });
    }

    createAsyncRequestMiddleware(){
        return createAsyncMiddleware(async (req, res, next) => {
            try {
                const response = await this.fetch(this.url, req);
                res.result = response;
            } catch (error:any) {
                console.error("AsyncRequestMiddleware error:", error);
                res.error = error?.message || error;
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
            console.error(`Fetch error: ${error.message || 'unknown error'}`);
            throw error;
        }
    }

}