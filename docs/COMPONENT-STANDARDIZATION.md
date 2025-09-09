# Component Standardization Guide

## Overview

This document outlines the standardized patterns for all UI components in the OpenWebUI Config Tool project. All components have been updated to follow pure React patterns without Next.js dependencies.

## ✅ Completed Standardizations

### Next.js Dependencies Removed
- ❌ Removed all `"use client"` directives (65+ files)
- ❌ Replaced `next-themes` with custom browser-native theme management
- ✅ All components now work in browser-native React environment

### Theme Management
- Created custom `useTheme` hook at `src/hooks/use-theme.ts`
- Updated `ThemeProvider` to use browser-native localStorage and CSS classes
- Updated `Toaster` component to use new theme system

## Component Interface Standards

### Form Field Components

All form field components follow this standardized interface pattern:

```typescript
interface BaseFieldProps {
  label: string
  description?: string
  error?: string
  disabled?: boolean
  id?: string
}
```

#### Text-based Fields (`TextField`, `SecretField`, `URLInput`)
```typescript
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {
  maxLength?: number
  showCharCount?: boolean
}
```

#### Selection Fields (`SelectField`)
```typescript
interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface SelectOption {
  value: string
  label: string
}
```

#### Toggle Fields (`ToggleField`)
```typescript
interface ToggleFieldProps extends BaseFieldProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}
```

### Layout Components

#### Field Group
```typescript
interface FieldGroupProps {
  label?: string
  description?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}
```

#### Category Section
```typescript
interface CategorySectionProps {
  title: string
  description?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
}
```

### Wrapper Components

#### Conditional Field
```typescript
interface ConditionalFieldProps {
  condition: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}
```

#### Plan Restricted Feature
```typescript
interface PlanRestrictedFeatureProps {
  planRequired: 'basic' | 'pro' | 'enterprise'
  children: React.ReactNode
  fallbackText?: string
}
```

## TypeScript Standards

### Required Patterns
1. **Explicit Interface Definitions**: All components must have proper TypeScript interfaces
2. **Generic Extensions**: Use `extends React.ComponentProps<T>` where appropriate  
3. **Proper React Types**: Use `React.ReactNode` for children, proper event types
4. **forwardRef Usage**: Complex components should use `React.forwardRef` with proper typing

### Example Component Structure
```typescript
import React from 'react'

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Component-specific props
  title: string
  variant?: 'default' | 'outlined'
  children: React.ReactNode
}

export function Component({ title, variant = 'default', children, className, ...props }: ComponentProps) {
  return (
    <div className={cn('component-base', variant === 'outlined' && 'outlined', className)} {...props}>
      <h3>{title}</h3>
      {children}
    </div>
  )
}
```

## Browser Compatibility

### Requirements Met
- ✅ No Next.js dependencies
- ✅ Pure React (18.2.0) implementation
- ✅ ES2020+ target compatibility
- ✅ Modern browser API usage (localStorage, matchMedia)
- ✅ CSS-based theming (no JS theme switching)

### Supported Features
- CSS custom properties (CSS variables)
- CSS class-based theming
- localStorage for persistence
- matchMedia for system theme detection
- Modern ES features (optional chaining, nullish coalescing)

## Component Categories

### Basic UI Components (26 components)
- `Button`, `Input`, `Label`, `Card`, `Badge`, etc.
- Follow shadcn/ui patterns with Radix UI primitives
- Consistent variant and size props using `class-variance-authority`

### Form Components (23 components)

#### Form Fields (11)
- `TextField` - Text input with validation
- `SecretField` - Password input with visibility toggle
- `SelectField` - Dropdown selection
- `ToggleField` - Switch/toggle input  
- `URLInput` - URL validation input
- `MarkdownTextArea` - Rich text area
- `ArrayField` - Dynamic list management
- `NumberField`, `IntegerField` - Numeric inputs
- `DateField` - Date selection
- `ObjectField` - Nested object inputs

#### Form Layouts (3)
- `FieldGroup` - Standard field container
- `CategorySection` - Grouped fields with headers
- `FormSection` - Form layout wrapper

#### Form Wrappers (3)
- `ConditionalField` - Conditional field rendering
- `PlanRestrictedFeature` - Feature gating by plan
- `OverrideableField` - Allow default overrides

#### Form Feedback (6)
- `ValidationMessage` - Error display
- `CharacterCounter` - Input length tracking
- `VisibilityNotice` - Public/private indicators
- `SaveButton` - Smart save with states
- `DangerousActionButton` - Destructive actions
- `ToastError` - Error notifications

### Navigation Components (2)
- `HierarchicalNavigation` - Nested menu system
- `SectionAccordion` - Collapsible sections

### Specialized Components (30+)
- Environment variable management
- API permission handling
- Framework presets
- Documentation links
- Path management
- Protection modes
- Team selection

## Testing & Validation

### TypeScript Validation
```bash
npm run typecheck  # ✅ Passes without errors
```

### Linting
```bash
npm run lint      # ✅ Follows ESLint rules
npm run lint:fix  # Auto-fixes formatting issues
```

### Build Validation
```bash
npm run build     # ✅ Builds for production deployment
```

## Future Maintenance

### Adding New Components
1. Follow the standardized interface patterns above
2. Use TypeScript interfaces, not inline types
3. Implement proper error handling and validation
4. Include JSDoc comments for complex props
5. Test in browser environment (no Node.js dependencies)

### Updating Existing Components
1. Maintain backward compatibility for props
2. Follow semantic versioning for breaking changes
3. Update documentation when changing interfaces
4. Ensure browser compatibility is maintained

## Migration Notes

### Completed Migrations
- **Theme System**: Migrated from `next-themes` to custom hook
- **Client Directives**: Removed all Next.js "use client" directives
- **Import Paths**: All imports use `@/` path mapping
- **TypeScript**: Full type coverage without `any` types

### No Breaking Changes
- All existing component APIs remain compatible
- Props interfaces unchanged for consumer code
- Component behavior preserved
- Styling and theming continue to work

This standardization ensures all components work reliably in browser-native React environments while maintaining the high-quality developer experience of the original shadcn/ui implementations.