import {Configuration} from './Configuration';

export class ConfigurationFactory {

    constructor(
        public defaultValues: { key: string, value: any }[],
        public allDomains: { domain: string, keys: string[] }[],
    ) {
        this.setUp(defaultValues, allDomains);
    }

    setUp(defaultValues: { key: string, value: any }[],
          allDomains: { domain: string, keys: string[] }[],) {
        this.defaultValues = defaultValues;
        this.allDomains = allDomains;
    }

    getConfiguration<T>(configThatOverride?: string | T): Configuration<T> {
        return new Configuration<T>(this.defaultValues, this.allDomains, configThatOverride);
    }
}

export const configurationFactory = new ConfigurationFactory([], []);
