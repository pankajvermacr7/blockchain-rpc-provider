import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class EthereumMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://mainnet.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = EthereumMainNetProvider.name;
    }
}