import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BaseSepoliaProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.url = `https://base-sepolia.infura.io/v3/${providerConfig.infuraConfig.API_KEY}`;
        this.source = BaseSepoliaProvider.name;
    }
}