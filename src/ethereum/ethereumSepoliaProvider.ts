import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class EthereumSepoliaProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = EthereumSepoliaProvider.name;
    }
}