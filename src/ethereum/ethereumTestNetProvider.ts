import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class EthereumTestNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = EthereumTestNetProvider.name;
    }
}