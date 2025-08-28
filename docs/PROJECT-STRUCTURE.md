# Project Structure: OpenWebUI Config Tool

## Configuration Files

### `wrangler.toml`
**Purpose**: Cloudflare Workers deployment configuration
- Worker name and compatibility settings
- Asset serving configuration
- Environment variable definitions
- Build and deployment settings

### `package.json`
**Purpose**: Project dependencies and scripts
- React and TypeScript dependencies
- Vite build tooling
- Tailwind CSS for styling
- Development and build scripts

### `vite.config.ts`
**Purpose**: Build configuration
- TypeScript compilation settings
- Asset optimization
- Development server configuration
- Build output optimization

### `tsconfig.json`
**Purpose**: TypeScript configuration
- Strict type checking settings
- Module resolution configuration
- Path mapping for imports
- Target browser compatibility

### `tailwind.config.js`
**Purpose**: CSS framework configuration
- Design system tokens
- Component styling utilities
- Responsive breakpoints
- Custom theme configuration

## Build and Deployment

### Development Workflow
1. Edit source files in `src/`
2. Build generates optimized assets in `dist/`
3. Deploy directly to Cloudflare Workers
4. No local development server needed

### Asset Organization
- `dist/` contains all build outputs
- Static assets served by Cloudflare Workers
- Optimized for edge caching
- Single-file SPA deployment

### Deployment Process
1. Run build process to generate `dist/`
2. Deploy to Cloudflare Workers using Wrangler CLI
3. Automatic global distribution
4. Zero-downtime deployments

## Data Flow Architecture

### Component Hierarchy
```
App.tsx
├── Header
├── ModeToggle
├── ConfigForm (Form Mode)
│   ├── CategorySection[]
│   └── FormField[]
├── RawEditor (Raw Mode)
└── ImportExportControls
```

### State Management
- React state for UI components
- localStorage for persistence
- No external state management library needed
- Simple prop drilling for data flow

### Event Flow
- User input → Component state → Validation → Storage
- Import → Parse → Validate → Component state
- Export → Validate → Format → Download
- Mode switch → Convert → Sync → Update UI
