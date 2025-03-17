import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BscTestNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = BscTestNetProvider.name;
    }
}