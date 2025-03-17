import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BscMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = BscMainNetProvider.name;
    }
}