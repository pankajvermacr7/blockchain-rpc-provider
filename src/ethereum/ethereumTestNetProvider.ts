import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { InfuraConfig } from "./type";

export class EthereumTestNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://rinkeby.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = EthereumTestNetProvider.name;
    }
}