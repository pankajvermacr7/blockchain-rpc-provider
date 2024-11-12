import { ProviderBase } from "../provider/provider";
import { providerConfig } from "../provider/types";
import { AnkrConfig } from "./type";
import { ANKR_PROVIDER_ENDPOINTS } from "./enum";

export class AnkrMultiChainProvider extends ProviderBase {
    private ankrConfig: AnkrConfig;
    constructor(providerConfig: providerConfig, ankrConfig: AnkrConfig) {
        super(providerConfig);
        this.ankrConfig = ankrConfig;
        this.url = `${this.ankrConfig.ANKR_BASE_URL}/${ANKR_PROVIDER_ENDPOINTS.MULTICHAIN}/${this.ankrConfig.ANKR_API_KEY}`;
    }

}