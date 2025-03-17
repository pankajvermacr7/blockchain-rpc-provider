import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class AnkrSolanaDevNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = AnkrSolanaDevNetProvider.name;
    }
}