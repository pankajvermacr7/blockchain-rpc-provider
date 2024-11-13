import { JsonRpcEngine, JsonRpcMiddleware, JsonRpcRequest } from "json-rpc-engine";

export interface providerInterface{
    allowStaleOnFailure: boolean;
    engine : JsonRpcEngine;
    isCacheEnabled: boolean;
    cacheAbleMethods: string[];
    sendAsync(request: JsonRpcRequest<any>): Promise<any>;
    createAsyncRequestMiddleware(opts: {url : string}) : JsonRpcMiddleware<any,any>;
}