import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class AnkrMultiChainProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = AnkrMultiChainProvider.name;
    }
}   