import {ConfigurationFactory} from "./ConfigurationFactory";

export class Configuration<T> {

    protected allValues: any;

    constructor(protected defaultValues: { key: string, value: any }[],
                protected allDomains: { domain: string, keys: string[] }[],
                configThatOverride?: string | T) {
        this.build(configThatOverride);
    }

    protected static Walk(container: any, parent: any, keys: string[], path: { name: string, type: string }[]) {
        for (const key of keys) {

            let subs = [];
            if (typeof parent[key] === 'object' && !Array.isArray(parent[key])) {
                subs = Object.keys(parent[key]);
            }

            if (subs.length) {
                const type = 'object';
                const subPath = path.concat([{name: key, type}]);
                Configuration.Walk(container, parent[key], subs, subPath);
            } else {
                let containerEl = container;
                for (const pathEl of path) {
                    if (!containerEl.hasOwnProperty(pathEl.name)) {
                        if (pathEl.type === 'object') {
                            containerEl[pathEl.name] = {};
                        } else {
                            containerEl[pathEl.name] = [];
                        }
                    }

                    containerEl = containerEl[pathEl.name];
                }
                containerEl[key] = parent[key];
            }
        }
    };

    public getConf(domain?: string): T {
        let conf = this.allValues;
        if (!domain) {
            return conf;
        }

        const found = this.allDomains.filter(d => d.domain === domain);
        if (found.length !== 1) {
            return conf;
        }

        conf = {};
        for (const key of found[0].keys) {
            conf[key] = this.allValues[key];
        }

        return conf;
    }

    public getSubConf(key: string): T {
        return this.allValues[key];
    }

    public getJSON(domain?: string) : string {
        return JSON.stringify(this.getConf(domain));
    }

    public getSubJSON(key: string) : string {
        return JSON.stringify(this.getSubConf(key));
    }

    public contains(configurationAsString: string | any) {
        let confToCompare = configurationAsString;
        try {
            if (typeof configurationAsString === 'string') {
                confToCompare = JSON.parse(configurationAsString);
            }
        } catch (_) {
        }

        const currentConf = this.getConf();
        for (const p in currentConf) {
            if (currentConf.hasOwnProperty(p) === confToCompare.hasOwnProperty(p)) {
                if (JSON.stringify(currentConf[p]) !== JSON.stringify(confToCompare[p])) {
                    return false;
                }
            }
        }

        return true;
    }

    public merge(configurationAsString:  string | any) {
        if (!configurationAsString) {
            return;
        }

        let confToMerge: JSON = configurationAsString as JSON;
        try {
            if (typeof configurationAsString === 'string') {
                confToMerge = JSON.parse(configurationAsString);
            }
        } catch (e) {
        }

        if (Object.keys(confToMerge).length === 0 ) {
            this.allValues = {};
            this.defaultValues = [];
            this.build();
            return;
        }

        const currentConf = this.getConf();
        for (const key in confToMerge) {
            if (confToMerge.hasOwnProperty(key)) {
                if (currentConf[key]) {
                    this.add(key, confToMerge[key]);
                } else {
                    this.set(key, confToMerge[key]);
                }
            }
        }
    }

    public set(keyToUpsert: string, value: any) {
        const conf = this.getConf();
        conf[keyToUpsert] = value;
        this.build(conf);
    }

    public add(alreadyExistingKey: string, toAdd: any) {
        const conf = this.getConf();
        try {
            const container = JSON.parse(JSON.stringify(conf[alreadyExistingKey]));

            Configuration.Walk(container, toAdd, Object.keys(toAdd), []);
            conf[alreadyExistingKey] = container;
            this.build(conf);
        } catch (e) {
            console.error(e);
        }
    }

    public update(configurationFactory: ConfigurationFactory) {
        const keys = Object.keys(this.allValues);
        configurationFactory.defaultValues = [];
        for (const key of keys) {
            const value = JSON.parse(JSON.stringify(this.allValues[key]));
            configurationFactory.defaultValues.push({key, value});
        }
        configurationFactory.allDomains = JSON.parse(JSON.stringify(this.allDomains));
    }

    protected build(configThatOverride?: T | string) {

        this.allValues = {};

        try {
            if (typeof configThatOverride === 'string') {
                configThatOverride = JSON.parse(configThatOverride);
            }
        } catch (e) {
            // logger.warn('Configuration issue:', e);
        }

        for (const defaultValue of this.defaultValues) {
            this.allValues[defaultValue.key] = defaultValue.value;
        }

        if (configThatOverride) {
            for (const key of Object.keys(configThatOverride)) {
                if (configThatOverride.hasOwnProperty(key)) {
                    this.allValues[key] = configThatOverride[key];
                }
            }
        }

    }
}
