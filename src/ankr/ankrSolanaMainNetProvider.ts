import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { ANKR_PROVIDER_ENDPOINTS } from "./enum";

export class AnkrSolanaMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://rpc.ankr.com/${ANKR_PROVIDER_ENDPOINTS.SOLANA}/${providerConfig.ankrConfig.API_KEY}`;
        this.source = AnkrSolanaMainNetProvider.name;
    }
}