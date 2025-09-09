# Task 021: Enhanced Validation Pipeline

**Priority:** Medium  
**Estimated Complexity:** Medium  
**Prerequisites:** Task 018 (Form Component Integration), Task 020 (Legacy Code Cleanup)

## Context
Implement comprehensive validation using RJSF's native AJV-based validation system, enhancing the current validation with real-time feedback, cross-field validation, and export-specific validation warnings.

## Objective
Create a robust validation pipeline that provides immediate feedback during form interaction and comprehensive validation before export, leveraging JSON Schema validation capabilities.

## Technical Requirements

### 1. Native JSON Schema Validation
Leverage JSON Schema's built-in validation features:
```json
{
  "properties": {
    "OPENAI_API_KEY": {
      "type": "string",
      "pattern": "^sk-[A-Za-z0-9]{48}$",
      "minLength": 51,
      "maxLength": 51,
      "description": "OpenAI API key starting with 'sk-'"
    },
    "WEBUI_URL": {
      "type": "string", 
      "format": "uri",
      "pattern": "^https?://",
      "description": "Valid HTTP/HTTPS URL"
    }
  },
  "dependencies": {
    "ENABLE_OPENAI_API": {
      "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
      "then": { "required": ["OPENAI_API_KEY"] },
      "else": { "not": { "required": ["OPENAI_API_KEY"] } }
    }
  }
}
```

### 2. Enhanced Validation Components
Extend existing validation components for richer feedback:

```tsx
// src/components/ui/form/feedback/enhanced-validation-message.tsx
export function EnhancedValidationMessage({ 
  errors, 
  warnings, 
  suggestions 
}: EnhancedValidationProps) {
  return (
    <div className="space-y-2">
      {errors.map(error => (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ))}
      
      {warnings.map(warning => (
        <Alert variant="warning">
          <Info className="h-4 w-4" />
          <AlertDescription>{warning.message}</AlertDescription>
        </Alert>
      ))}
      
      {suggestions.map(suggestion => (
        <Alert variant="info">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>{suggestion.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
```

### 3. Real-time Validation System
```tsx
// src/hooks/use-enhanced-validation.ts
export function useEnhancedValidation(schema: JSONSchema, formData: any) {
  const [validationState, setValidationState] = useState({
    errors: new Map(),
    warnings: new Map(),
    suggestions: new Map(),
    isValid: false
  });
  
  const validateField = useCallback((fieldName: string, value: any) => {
    // Real-time field validation
    // Cross-field dependency validation
    // Context-aware suggestions
  }, [schema, formData]);
  
  const validateForm = useCallback(() => {
    // Full form validation
    // Export readiness check
    // Security validation
  }, [schema, formData]);
  
  return { validationState, validateField, validateForm };
}
```

## Deliverables

### Validation Core
- `src/validation/enhanced-validator.ts` - Extended AJV validator with custom rules
- `src/validation/validation-rules.ts` - Custom validation rule definitions
- `src/validation/cross-field-validator.ts` - Cross-field dependency validation
- `src/validation/export-validator.ts` - Export-specific validation checks

### UI Components
- `src/components/ui/form/feedback/enhanced-validation-message.tsx` - Rich validation display
- `src/components/ui/form/feedback/validation-summary.tsx` - Form-wide validation summary
- `src/components/ui/form/feedback/field-status-indicator.tsx` - Per-field status icons
- `src/components/ui/form/feedback/export-readiness-indicator.tsx` - Export readiness check

### Integration Components
- `src/form/ValidatedFieldTemplate.tsx` - Field template with enhanced validation
- `src/form/ValidationIntegration.tsx` - RJSF validation integration
- `src/hooks/use-enhanced-validation.ts` - Validation state management

### Validation Rules
- `src/validation/rules/api-key-rules.ts` - API key format validation
- `src/validation/rules/url-rules.ts` - URL and endpoint validation
- `src/validation/rules/security-rules.ts` - Security-related validation
- `src/validation/rules/dependency-rules.ts` - Field dependency validation

## Acceptance Criteria

**Real-time Validation:**
- [ ] Field validation triggers on blur/change events
- [ ] Validation messages appear immediately
- [ ] Cross-field validation updates dependent fields
- [ ] Performance remains responsive (< 100ms validation time)

**Validation Coverage:**
- [ ] All 370+ fields have appropriate validation rules
- [ ] API key formats validated (OpenAI, Anthropic, etc.)
- [ ] URL formats validated for all endpoint fields
- [ ] Required field dependencies enforced
- [ ] Security best practices validated

**User Experience:**
- [ ] Clear, actionable error messages
- [ ] Contextual help and suggestions
- [ ] Progressive validation (warnings vs. errors)
- [ ] Export readiness indicators

**Export Validation:**
- [ ] Pre-export validation check
- [ ] Format-specific warnings (ENV vs. JSON vs. Docker)
- [ ] Security warnings for exposed sensitive data
- [ ] Completeness validation for production deployments

## Implementation Details

### Custom AJV Rules
```typescript
// src/validation/custom-ajv-rules.ts
export const customFormats = {
  'openai-key': {
    validate: (key: string) => /^sk-[A-Za-z0-9]{48}$/.test(key),
    error: 'Must be a valid OpenAI API key starting with "sk-"'
  },
  
  'docker-image': {
    validate: (image: string) => /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*(?::[a-z0-9]+(?:[._-][a-z0-9]+)*)?$/.test(image),
    error: 'Must be a valid Docker image name'
  },
  
  'env-var-name': {
    validate: (name: string) => /^[A-Z][A-Z0-9_]*$/.test(name),
    error: 'Environment variable names must be UPPERCASE with underscores'
  }
};

export function setupCustomValidator() {
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);
  
  // Add custom formats
  Object.entries(customFormats).forEach(([name, format]) => {
    ajv.addFormat(name, format);
  });
  
  return ajv;
}
```

### Cross-field Validation
```typescript
// src/validation/cross-field-validator.ts
export class CrossFieldValidator {
  validateDependencies(formData: any, schema: JSONSchema): ValidationResult[] {
    const errors: ValidationResult[] = [];
    
    // Check conditional requirements
    if (formData.ENABLE_OPENAI_API && !formData.OPENAI_API_KEY) {
      errors.push({
        field: 'OPENAI_API_KEY',
        message: 'API key is required when OpenAI integration is enabled',
        severity: 'error'
      });
    }
    
    // Check provider-specific field bundles
    if (formData.VECTOR_DB === 'pinecone' && !formData.PINECONE_API_KEY) {
      errors.push({
        field: 'PINECONE_API_KEY', 
        message: 'Pinecone API key required when using Pinecone vector database',
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  validateSecurityBestPractices(formData: any): ValidationResult[] {
    const warnings: ValidationResult[] = [];
    
    // Warn about default passwords
    if (formData.WEBUI_SECRET_KEY === 'default' || !formData.WEBUI_SECRET_KEY) {
      warnings.push({
        field: 'WEBUI_SECRET_KEY',
        message: 'Using default or empty secret key is insecure',
        severity: 'warning',
        suggestion: 'Generate a strong random secret key'
      });
    }
    
    return warnings;
  }
}
```

### Export-specific Validation
```typescript
// src/validation/export-validator.ts
export class ExportValidator {
  validateForProduction(formData: any): ExportValidationResult {
    const errors: ValidationResult[] = [];
    const warnings: ValidationResult[] = [];
    
    // Check for development-only values
    if (formData.WEBUI_URL?.includes('localhost')) {
      warnings.push({
        field: 'WEBUI_URL',
        message: 'Localhost URL detected - update for production deployment',
        severity: 'warning'
      });
    }
    
    // Check for missing critical production settings
    if (!formData.WEBUI_SECRET_KEY) {
      errors.push({
        field: 'WEBUI_SECRET_KEY',
        message: 'Secret key is required for production deployment',
        severity: 'error'
      });
    }
    
    return {
      isReady: errors.length === 0,
      errors,
      warnings,
      suggestions: this.generateProductionSuggestions(formData)
    };
  }
  
  validateForFormat(formData: any, format: 'env' | 'json' | 'docker'): ValidationResult[] {
    switch (format) {
      case 'env':
        return this.validateEnvFormat(formData);
      case 'json':
        return this.validateJsonFormat(formData);  
      case 'docker':
        return this.validateDockerFormat(formData);
      default:
        return [];
    }
  }
}
```

### Enhanced Field Template
```tsx
// src/form/ValidatedFieldTemplate.tsx
export default function ValidatedFieldTemplate(props: FieldTemplateProps) {
  const { validationState, validateField } = useEnhancedValidation();
  const fieldValidation = validationState.get(props.id);
  
  return (
    <FieldGroup 
      label={props.label} 
      required={props.required}
      status={getFieldStatus(fieldValidation)}
    >
      {props.children}
      
      <div className="mt-2 space-y-1">
        <EnhancedValidationMessage
          errors={fieldValidation?.errors || []}
          warnings={fieldValidation?.warnings || []}
          suggestions={fieldValidation?.suggestions || []}
        />
        
        {props.schema.maxLength && (
          <CharacterCounter 
            current={props.value?.length || 0}
            max={props.schema.maxLength}
          />
        )}
      </div>
    </FieldGroup>
  );
}
```

## Integration with Export System

### Pre-export Validation
```tsx
// src/components/export-controls.tsx (enhanced)
export function ExportControls({ configData, format }) {
  const exportValidator = new ExportValidator();
  const validationResult = exportValidator.validateForProduction(configData);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <ExportReadinessIndicator 
          isReady={validationResult.isReady}
          errors={validationResult.errors}
          warnings={validationResult.warnings}
        />
        
        <Button 
          onClick={() => handleExport(format)}
          disabled={!validationResult.isReady}
        >
          Export {format.toUpperCase()}
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Success Metrics
- **Validation Coverage:** 100% of fields have validation rules
- **Real-time Performance:** < 100ms validation response time
- **Error Reduction:** 50% fewer invalid exports
- **User Experience:** Clear, actionable validation messages
- **Security:** Proactive warnings for security best practices

## Next Task Dependencies  
- Task 022: Build Process Optimization
- Task 023: Advanced UI Component Integration