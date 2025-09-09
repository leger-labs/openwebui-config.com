# Task 023: Advanced UI Component Integration

**Priority:** Low  
**Estimated Complexity:** Medium  
**Prerequisites:** Task 018 (Form Component Integration), Task 021 (Enhanced Validation Pipeline)

## Context
Implement advanced UI components and features that leverage the full ecosystem of existing shadcn/ui components: plan restrictions, overrideable fields, visibility notices, and enhanced user experience features.

## Objective
Complete the integration of all advanced UI components to provide a production-ready configuration tool with enterprise features and enhanced user experience.

## Technical Requirements

### 1. Plan-Restricted Features Integration
Integrate the existing PlanRestrictedFeature wrapper with RJSF:

```tsx
// src/form/custom-fields/PlanRestrictedField.tsx
import { PlanRestrictedFeature } from "@/components/ui/form/wrappers/plan-restricted-feature";

export function PlanRestrictedField(props: FieldProps) {
  const planRequired = props.uiSchema?.["ui:planRequired"];
  
  if (!planRequired) {
    return <DefaultFieldTemplate {...props} />;
  }
  
  return (
    <PlanRestrictedFeature planRequired={planRequired}>
      <DefaultFieldTemplate {...props} />
    </PlanRestrictedFeature>
  );
}

// Usage in uiSchema
{
  "OPENAI_API_KEY": {
    "ui:field": "PlanRestrictedField",
    "ui:planRequired": "pro",
    "ui:widget": "PasswordWidget"
  }
}
```

### 2. Overrideable Field Implementation
Enable users to override default values with visual indicators:

```tsx
// src/form/custom-fields/OverrideableField.tsx
import { OverrideableField } from "@/components/ui/form/wrappers/overrideable-field";

export function OverrideableFieldWrapper(props: FieldProps) {
  const isOverrideable = props.uiSchema?.["ui:overrideable"];
  const defaultValue = props.schema.default;
  
  if (!isOverrideable) {
    return <DefaultFieldTemplate {...props} />;
  }
  
  return (
    <OverrideableField 
      defaultValue={defaultValue}
      onOverride={(isOverridden) => handleOverride(props.id, isOverridden)}
    >
      <DefaultFieldTemplate {...props} />
    </OverrideableField>
  );
}
```

### 3. Enhanced SaveButton Integration
Integrate the SaveButton component with form state management:

```tsx
// src/components/enhanced-export-controls.tsx
import { SaveButton } from "@/components/ui/form/feedback/save-button";

export function EnhancedExportControls({ 
  formData, 
  validationState, 
  onExport 
}: EnhancedExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await onExport(format);
      setIsDirty(false);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExportReadinessIndicator 
          isReady={validationState.isValid}
          errors={validationState.errors}
          warnings={validationState.warnings}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SaveButton
            isLoading={isExporting}
            isDirty={isDirty}
            disabled={!validationState.isValid}
            onClick={() => handleExport('env')}
          >
            Export .env
          </SaveButton>
          
          <SaveButton
            isLoading={isExporting}
            isDirty={isDirty}
            disabled={!validationState.isValid}
            onClick={() => handleExport('json')}
          >
            Export JSON
          </SaveButton>
          
          <SaveButton
            isLoading={isExporting}
            isDirty={isDirty}
            disabled={!validationState.isValid}
            onClick={() => handleExport('docker')}
          >
            Export Docker
          </SaveButton>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Visibility Notice Integration
Show public/private indicators for configuration fields:

```tsx
// src/form/custom-fields/VisibilityAwareField.tsx
import { VisibilityNotice } from "@/components/ui/form/feedback/visibility-notice";

export function VisibilityAwareFieldTemplate(props: FieldTemplateProps) {
  const visibility = props.uiSchema?.["ui:visibility"];
  const isPublic = visibility === "public";
  const isPrivate = visibility === "private";
  
  return (
    <FieldGroup label={props.label} required={props.required}>
      {props.children}
      
      <div className="flex items-center justify-between mt-2">
        <div className="space-y-1">
          {props.rawErrors && (
            <ValidationMessage errors={props.rawErrors} />
          )}
        </div>
        
        {(isPublic || isPrivate) && (
          <VisibilityNotice isPublic={isPublic} />
        )}
      </div>
    </FieldGroup>
  );
}
```

## Deliverables

### Custom Field Components
- `src/form/custom-fields/PlanRestrictedField.tsx` - Plan restriction wrapper
- `src/form/custom-fields/OverrideableField.tsx` - Overrideable field wrapper
- `src/form/custom-fields/VisibilityAwareField.tsx` - Visibility-aware field template
- `src/form/custom-fields/ConditionalField.tsx` - Conditional field wrapper

### Enhanced Export System
- `src/components/enhanced-export-controls.tsx` - Advanced export interface
- `src/components/export-readiness-indicator.tsx` - Export readiness display
- `src/components/export-format-selector.tsx` - Export format selection
- `src/hooks/use-export-state.ts` - Export state management

### Advanced UI Features
- `src/components/configuration-summary.tsx` - Configuration overview
- `src/components/field-search.tsx` - Configuration field search
- `src/components/configuration-templates.tsx` - Pre-built templates
- `src/components/deployment-helper.tsx` - Deployment assistance

### Documentation Integration
- `src/components/ui/docs/contextual-help.tsx` - Context-sensitive help
- `src/components/ui/docs/field-documentation.tsx` - Per-field documentation
- `src/utils/documentation-links.ts` - Documentation URL management

## Acceptance Criteria

**Plan-Restricted Features:**
- [ ] Plan restrictions clearly displayed for enterprise features
- [ ] Upgrade prompts shown for restricted features
- [ ] Free tier limitations properly enforced
- [ ] Visual indicators for plan-locked features

**Overrideable Fields:**
- [ ] Default values clearly displayed
- [ ] Override toggle functionality working
- [ ] Visual indicators for overridden vs. default values
- [ ] Reset to default functionality

**Enhanced Export:**
- [ ] Export readiness validation before download
- [ ] Multiple export formats (ENV, JSON, Docker)
- [ ] Progress indicators during export
- [ ] Success/error feedback after export

**Advanced Features:**
- [ ] Configuration search and filtering
- [ ] Pre-built configuration templates
- [ ] Contextual help and documentation
- [ ] Deployment guidance and validation

## Implementation Details

### Plan Configuration
```typescript
// src/config/plans.ts
export interface PlanFeature {
  name: string;
  description: string;
  requiredPlan: 'free' | 'pro' | 'enterprise';
  category: string;
}

export const planFeatures: PlanFeature[] = [
  {
    name: 'OAUTH_SIGNUP',
    description: 'OAuth-based user authentication',
    requiredPlan: 'pro',
    category: 'Authentication'
  },
  {
    name: 'CUSTOM_THEMES',
    description: 'Custom UI themes and branding',
    requiredPlan: 'enterprise', 
    category: 'Customization'
  }
  // ... more features
];

export function getRequiredPlan(fieldName: string): string | null {
  const feature = planFeatures.find(f => f.name === fieldName);
  return feature?.requiredPlan || null;
}
```

### Enhanced uiSchema Configuration
```json
{
  "OAUTH_SIGNUP": {
    "ui:field": "PlanRestrictedField",
    "ui:planRequired": "pro",
    "ui:widget": "CheckboxWidget",
    "ui:help": "Enable OAuth authentication for seamless user login"
  },
  
  "WEBUI_SECRET_KEY": {
    "ui:field": "OverrideableField", 
    "ui:overrideable": true,
    "ui:widget": "PasswordWidget",
    "ui:visibility": "private",
    "ui:generateButton": true
  },
  
  "WEBUI_URL": {
    "ui:field": "VisibilityAwareField",
    "ui:widget": "URLWidget",
    "ui:visibility": "public",
    "ui:help": "This URL will be publicly accessible"
  }
}
```

### Configuration Templates
```typescript
// src/templates/configuration-templates.ts
export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'production' | 'enterprise';
  config: Partial<ConfigData>;
  requiredPlan?: string;
}

export const templates: ConfigurationTemplate[] = [
  {
    id: 'local-development',
    name: 'Local Development',
    description: 'Quick setup for local development environment',
    category: 'development',
    config: {
      WEBUI_URL: 'http://localhost:3000',
      ENABLE_SIGNUP: 'true',
      DEFAULT_USER_ROLE: 'admin',
      WEBUI_AUTH: 'false'
    }
  },
  
  {
    id: 'production-basic',
    name: 'Production (Basic)',
    description: 'Production-ready configuration with essential security',
    category: 'production',
    config: {
      ENABLE_SIGNUP: 'false',
      DEFAULT_USER_ROLE: 'pending',
      WEBUI_AUTH: 'true',
      // ... production defaults
    }
  },
  
  {
    id: 'enterprise-sso',
    name: 'Enterprise with SSO',
    description: 'Enterprise deployment with single sign-on',
    category: 'enterprise',
    requiredPlan: 'enterprise',
    config: {
      OAUTH_SIGNUP: 'true',
      ENABLE_OAUTH_SIGNUP: 'true',
      // ... enterprise features
    }
  }
];
```

### Field Search Implementation
```tsx
// src/components/field-search.tsx
export function FieldSearch({ schema, onFieldSelect }: FieldSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFields, setFilteredFields] = useState([]);
  
  const searchFields = useMemo(() => {
    return Object.entries(schema.properties).map(([name, field]) => ({
      name,
      title: field.title || name,
      description: field.description || '',
      category: field.category || 'Other'
    }));
  }, [schema]);
  
  useEffect(() => {
    if (!searchQuery) {
      setFilteredFields([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = searchFields.filter(field => 
      field.name.toLowerCase().includes(query) ||
      field.title.toLowerCase().includes(query) ||
      field.description.toLowerCase().includes(query)
    );
    
    setFilteredFields(filtered.slice(0, 10)); // Limit results
  }, [searchQuery, searchFields]);
  
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder="Search configuration fields..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {filteredFields.length > 0 && (
          <CommandGroup heading="Configuration Fields">
            {filteredFields.map(field => (
              <CommandItem
                key={field.name}
                onSelect={() => onFieldSelect(field.name)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{field.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {field.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
```

## Advanced Features

### Configuration Summary
Display overview of current configuration with completion status:
```tsx
// src/components/configuration-summary.tsx
export function ConfigurationSummary({ formData, schema }: ConfigurationSummaryProps) {
  const completionStats = calculateCompletionStats(formData, schema);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {completionStats.completedFields}
            </div>
            <div className="text-sm text-muted-foreground">
              Fields Configured
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold">
              {Math.round(completionStats.completionPercentage)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Complete
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {completionStats.warningCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Warnings
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-red-600">
              {completionStats.errorCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Errors
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Success Metrics
- **Feature Coverage:** All advanced UI components integrated
- **User Experience:** Smooth, intuitive interaction flow
- **Plan Integration:** Clear plan restrictions and upgrade paths
- **Export Quality:** Multiple formats with validation
- **Documentation:** Contextual help throughout the interface

## Next Task Dependencies
- Task 024: Final Testing and Documentation
- Task 025: Production Deployment and Launch