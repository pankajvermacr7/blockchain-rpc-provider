import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { InfuraConfig } from "./type";

export class EthereumSepoliaProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig, config: InfuraConfig) {
        super(providerConfig);
        this.url = `https://sepolia.infura.io/v3/${config.INFURA_PROJECT_ID}`;
        this.source = EthereumSepoliaProvider.name;
    }
}