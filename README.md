# OpenWebUI Configuration Tool

A visual configuration tool for [OpenWebUI](https://github.com/open-webui/open-webui) deployments. Generate valid `.env` configuration files through an intuitive form interface.

## Features

- **Visual Form Editor**: 370+ configuration fields organized by category
- **Smart Validation**: Real-time validation with helpful error messages
- **Conditional Fields**: Dynamic form that shows/hides fields based on your selections
- **Import/Export**: Support for `.env`, JSON, and Docker formats
- **Raw Editor Mode**: Direct text editing for advanced users
- **Auto-save**: Configuration automatically saved to browser storage

## Quick Start

Visit [openwebui-config.com](https://openwebui-config.com) to start configuring your OpenWebUI deployment.

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Configuration Categories

- **General Settings**: Basic application configuration
- **AI Integrations**: OpenAI, Anthropic, and local model settings
- **Authentication**: OAuth, LDAP, and user management
- **Database**: PostgreSQL, MySQL, and SQLite options
- **Storage**: S3 and local storage configuration
- **Security**: Rate limiting, CORS, and security headers
- **Advanced**: Custom endpoints and experimental features

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Forms**: React JSON Schema Form (RJSF)
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Vite
- **Deployment**: Cloudflare Workers/Pages

## Contributing

Contributions are welcome! Please see our [Contributing Guide](docs/contributing.md) for details.

## Documentation

- [User Guide](docs/user-guide.md) - Complete usage instructions
- [Field Reference](docs/field-reference.md) - All configuration fields explained
- [Architecture](docs/architecture.md) - Technical overview
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/leger-labs/openwebui-config.com/issues)
- **OpenWebUI**: [OpenWebUI Documentation](https://docs.openwebui.com)

---

Built with ❤️ by the OpenWebUI community