import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { InfuraConfig } from "./type";

export class EthereumTestNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig, config: InfuraConfig) {
        super(providerConfig);
        this.url = `https://rinkeby.infura.io/v3/${config.INFURA_PROJECT_ID}`;
        this.source = EthereumTestNetProvider.name;
    }
}