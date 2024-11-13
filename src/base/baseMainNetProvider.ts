import { InfuraConfig } from "../ethereum/type";
import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BaseMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig, config: InfuraConfig) {
        super(providerConfig);
        this.url = `https://base-mainnet.infura.io/v3/${config.INFURA_PROJECT_ID}`;
        this.source = BaseMainNetProvider.name;
    }
}