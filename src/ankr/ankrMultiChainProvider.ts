import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { AnkrConfig } from "./type";
import { ANKR_PROVIDER_ENDPOINTS } from "./enum";

export class AnkrMultiChainProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://rpc.ankr.com/${ANKR_PROVIDER_ENDPOINTS.MULTICHAIN}/${providerConfig.ankrConfig.API_KEY}`;
        this.source = AnkrMultiChainProvider.name;
    }
}   