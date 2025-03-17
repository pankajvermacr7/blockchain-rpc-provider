import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class EthereumMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = EthereumMainNetProvider.name;
    }
}