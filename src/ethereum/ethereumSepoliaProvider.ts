import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";
import { InfuraConfig } from "./type";

export class EthereumSepoliaProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://sepolia.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = EthereumSepoliaProvider.name;
    }
}