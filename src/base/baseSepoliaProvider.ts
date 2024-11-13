import { InfuraConfig } from "../ethereum/type";
import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BaseSepoliaProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig, config: InfuraConfig) {
        super(providerConfig);
        this.url = `https://base-sepolia.infura.io/v3/${config.INFURA_PROJECT_ID}`;
        this.source = BaseSepoliaProvider.name;
    }
}