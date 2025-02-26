import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BaseMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://base-mainnet.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = BaseMainNetProvider.name;
    }
}