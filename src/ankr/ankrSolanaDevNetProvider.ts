import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { AnkrConfig } from "./type";
import { ANKR_PROVIDER_ENDPOINTS } from "./enum";

export class AnkrSolanaDevNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig, ankrConfig: AnkrConfig) {
        super(providerConfig);
        this.url = `${ankrConfig.ANKR_BASE_URL}/${ANKR_PROVIDER_ENDPOINTS.SOLANA_DEVNET}/${ankrConfig.ANKR_API_KEY}`;
        this.source = AnkrSolanaDevNetProvider.name;
    }
}