import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BscMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://bsc-mainnet.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = BscMainNetProvider.name;
    }
}