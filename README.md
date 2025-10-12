# mle-tools-configuration

[![npm version](https://badge.fury.io/js/mle-tools-configuration.svg)](https://www.npmjs.com/package/mle-tools-configuration)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/mlefree/mle-tools-configuration/actions/workflows/ci.yml/badge.svg)](https://github.com/mlefree/mle-tools-configuration/actions/workflows/ci.yml)

> A configuration management tool for TypeScript/JavaScript applications

## 🚀 Features

- 🔧 Type-safe configuration management
- 🔄 Dynamic configuration updates
- 🎯 Domain-based configuration organization
- 🛠 JSON-based configuration storage
- 📦 Easy integration with existing projects
- 🔍 Comprehensive documentation

## 📦 Installation

```bash
npm install mle-tools-configuration
```

## 🎯 Quick Start

```typescript
import { Configuration, configurationFactory } from 'mle-tools-configuration';

// Set up initial configuration
configurationFactory.setUp(
  [{ key: 'database', value: { host: 'localhost', port: 5432 } }],
  [{ domain: 'app', keys: ['database'] }]
);

// Get configuration instance
const config = configurationFactory.getConfiguration();

// Access configuration values
const dbConfig = config.getSubConf('database');
console.log(dbConfig); // { host: 'localhost', port: 5432 }

// Merge new configuration
config.merge({
  database: { username: 'admin' }
});
```

## 📚 Documentation

See the [CHANGELOG.md](./CHANGELOG.md) for a detailed list of changes.

## 🔧 API Reference

### Configuration Class

- `getJSON(domain?)`: Get the entire configuration as a JSON string
- `getSubJSON(key)`: Get a specific configuration section as a JSON string
- `getConf(domain?)`: Get the configuration object
- `getSubConf(key)`: Get a specific configuration section
- `contains(configurationAsString)`: Check if configuration contains the specified configuration
- `merge(conf)`: Merge new configuration
- `set(key, value)`: Set a specific configuration value
- `add(key, value)`: Add to existing configuration
- `update(factory)`: Update the configuration factory

### ConfigurationFactory

- `setUp(configs, domains)`: Initialize the configuration factory
- `getConfiguration(override?)`: Get a configuration instance

## 🧪 Testing

```bash
npm test
```

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed list of changes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🙏 Acknowledgments

- Built with TypeScript
- Tested with Mocha and Chai
- Coverage with NYC
