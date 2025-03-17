import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { ANKR_PROVIDER_ENDPOINTS } from "./enum";

export class AnkrSolanaMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = AnkrSolanaMainNetProvider.name;
    }
}