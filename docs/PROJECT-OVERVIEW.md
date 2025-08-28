# OpenWebUI Config Tool: Project Overview

## What We're Building

A single-page configuration tool at **openwebui-config.com** that generates valid `.env` configuration files for OpenWebUI deployments.

### Core Features
- **Visual Form Interface**: Category-based form with validation
- **Raw Text Editor**: Direct `.env` file editing using HTML textarea
- **Dual Mode**: Toggle between visual form and raw editor
- **Import/Export**: Upload existing configs, download generated `.env` files
- **Client-Side Only**: No authentication, accounts, or server persistence

### Target Users
- Developers setting up OpenWebUI instances
- System administrators configuring deployments  
- Anyone needing a user-friendly way to generate OpenWebUI configurations

## Architecture Philosophy

**Ultra-Simple Static SPA**: The entire application runs client-side with no backend complexity.

```
User Browser
├── Static HTML/CSS/JS (served by Cloudflare Workers)
├── OpenWebUI Schema Processing (client-side)
├── Form Validation (Zod schemas)
└── localStorage (persistence)
```

## What We're NOT Building

❌ **No Backend Complexity**
- No database
- No user authentication  
- No server-side APIs
- No multi-tenancy

❌ **No Advanced Features**
- No version control
- No team collaboration
- No subscription/billing
- No deployment automation

## Success Criteria

1. **Form Generation**: Automatically generate forms from OpenWebUI's environment variables
2. **Validation**: Prevent invalid configurations with real-time feedback
3. **Export Quality**: Generated `.env` files work perfectly with OpenWebUI
4. **User Experience**: Intuitive interface that's faster than manual config creation
5. **Performance**: Loads quickly, works offline after initial load

## Technology Stack

| Component | Choice | Justification |
|-----------|---------|---------------|
| Hosting | Cloudflare Workers | Global edge delivery, zero-config deployment |
| Frontend | React + TypeScript | Reuse existing form components |
| UI Library | shadcn/ui | Pre-built accessible components |
| Validation | Zod schemas | Type-safe validation, shared with form generation |
| Persistence | localStorage | No server needed, survives page refresh |
| Text Editor | HTML textarea | Simple, reliable, no external dependencies |

## Project Constraints

- **Single OpenWebUI Version**: Latest version only, no multi-version support
- **Client-Side Only**: All processing happens in the browser
- **No External Dependencies**: Self-contained tool with no API requirements
- **Browser Compatibility**: Modern browsers only (ES2020+)
- **Deployment Only**: No local development environment, deploy directly to Cloudflare Workers

## Existing Repository Structure

```
├── schemas/
│   └── openwebui-config-schema.json    # OpenWebUI configuration schema
├── scripts/
│   ├── extract-uiSchema/               # Extract UI metadata from schema
│   ├── generate-component-mapping/     # Map schema to form components
│   └── openapi-to-zod/                 # Convert OpenAPI to Zod schemas
└── src/
    └── components/                     # Reusable form field components
```

## Development Approach

1. **Reuse Existing Assets**: Leverage schema processing scripts and form components
2. **Build from Scratch**: Create new application components for the simplified scope
3. **Client-Side Focus**: All functionality implemented in browser
4. **Deploy-First**: Test and iterate directly on Cloudflare Workers
