import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BaseMainNetProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = BaseMainNetProvider.name;
    }
}