import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { AnkrConfig } from "./type";
import { ANKR_PROVIDER_ENDPOINTS } from "./enum";

export class AnkrSolanaDevNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://rpc.ankr.com/${ANKR_PROVIDER_ENDPOINTS.SOLANA_DEVNET}/${providerConfig.ankrConfig.API_KEY}`;
        this.source = AnkrSolanaDevNetProvider.name;
    }
}