# Cloudflare Workers SPA Expert Guide

## Overview
Expert guide for building client-side SPAs on Cloudflare Workers using TypeScript, React, Vite, shadcn UI, and Tailwind CSS.

## Cloudflare Workers Development

### wrangler.toml Configuration
```toml
name = "your-spa"
compatibility_date = "2025-04-01" 
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "single-page-application"

[placement]
mode = "smart"
```

### Worker Implementation
- Keep Worker code minimal - primarily for static asset serving
- Use single-page-application mode for client-side routing
- Leverage Smart Placement for optimal performance
- Use nodejs_compat flag for Node.js API access (crypto, etc.)

### Environment Variables
```typescript
// Access via process.env when nodejs_compat is enabled
const API_KEY = process.env.API_KEY || 'default'
```

## Code Style and Structure

### TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use maps or const objects instead
- Use functional components with TypeScript interfaces
- Enable strict mode in tsconfig.json

### Component Architecture
- Use functional components with the `function` keyword
- Favor named exports over default exports
- Structure files: exported component, subcomponents, helpers, types
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)

### Naming Conventions
- Use `kebab-case` for directories (e.g., `components/config-editor`)
- Use `PascalCase` for components and interfaces
- Use `camelCase` for variables, functions, props
- Use `UPPER_CASE` for constants and environment variables

## React Best Practices

### Component Patterns
```typescript
// Preferred pattern
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

### Performance Optimization
- Use React.memo() strategically for expensive components
- Implement useCallback for event handlers passed to child components
- Use useMemo for expensive computations
- Avoid inline function definitions in JSX
- Implement proper key props in lists (never use array index)

### State Management
- Use useState for simple component state
- Use useReducer for complex state logic
- Use useContext sparingly for shared state
- Prefer prop drilling over context for 2-3 levels
- Use localStorage directly for persistence (no server state)

## UI and Styling

### Tailwind CSS
- Use mobile-first responsive design approach
- Use utility classes over custom CSS
- Group utility classes logically (layout, spacing, colors, typography)
- Use Tailwind's built-in dark mode support
- Maintain consistent spacing scale (4, 8, 16, 24, 32px)

### shadcn/ui Integration
- Use shadcn components as base building blocks
- Customize via Tailwind classes rather than CSS overrides
- Compose complex components from shadcn primitives
- Ensure proper accessibility attributes are maintained

## Performance and Optimization

### Bundle Optimization
- Use dynamic imports for code splitting
- Tree shake unused dependencies
- Optimize images for web (WebP format)
- Minimize third-party dependencies
- Use proper Vite build optimizations

### Runtime Performance
- Debounce expensive operations (validation, API calls)
- Use proper cleanup in useEffect hooks
- Avoid memory leaks with event listeners
- Implement proper loading states
- Cache expensive computations

## Browser APIs and Storage

### localStorage Usage
```typescript
// Type-safe localStorage wrapper
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = (value: T) => {
    setValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [value, setStoredValue] as const
}
```

### File API Usage
- Use proper error handling for file operations
- Implement drag and drop with proper event handling
- Support clipboard API for copy/paste functionality
- Validate file types and sizes before processing

## Error Handling

### Component Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

### Async Error Handling
- Always wrap async operations in try/catch
- Provide meaningful error messages to users
- Log errors for debugging without exposing internals
- Implement graceful degradation for failed operations

## Form Handling and Validation

### React Hook Form + Zod
```typescript
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email')
})

function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* form fields */}
      </form>
    </Form>
  )
}
```

## Testing and Quality

### Code Quality
- Write unit tests for utility functions
- Use React Testing Library for component tests
- Maintain test coverage above 80% for critical paths
- Use TypeScript strict mode
- Implement proper JSDoc documentation

### Accessibility
- Use semantic HTML elements
- Provide proper ARIA attributes
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

## Deployment and Development

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [react(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-form']
        }
      }
    }
  }
})
```

### Wrangler Commands
```bash
# Development
wrangler dev                    # Local development with Workers runtime

# Deployment  
wrangler deploy                 # Deploy to production
wrangler deploy --env staging   # Deploy to staging environment

# Asset management
wrangler kv:namespace create    # Create KV namespace (if needed)
wrangler tail                   # View live logs
```

## Security and Best Practices

### Input Sanitization
- Validate all user inputs with Zod schemas
- Sanitize data before localStorage storage
- Escape user content when rendering
- Use proper Content Security Policy headers

### Performance Monitoring
- Monitor Core Web Vitals (LCP, FID, CLS)
- Track bundle size and loading performance
- Use proper loading states and skeleton screens
- Implement proper error tracking
