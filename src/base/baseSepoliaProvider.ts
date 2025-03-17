import { ProviderBase } from "../provider/provider";
import { ProviderConfig } from "../provider/types";

export class BaseSepoliaProvider extends ProviderBase {
    constructor(providerConfig: ProviderConfig) {
        super(providerConfig);
        this.source = BaseSepoliaProvider.name;
    }
}