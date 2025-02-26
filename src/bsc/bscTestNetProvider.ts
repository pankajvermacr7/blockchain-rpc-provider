import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BscTestNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://bsc-testnet.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = BscTestNetProvider.name;
    }
}