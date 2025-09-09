# Task 018: Form Component Integration

**Priority:** High  
**Estimated Complexity:** Medium  
**Prerequisites:** Task 017 (RJSF Widget Adapters)

## Context
Replace the current custom form generation system (ConfigForm.tsx) with RJSF-based form rendering while maintaining all existing functionality and user experience.

## Objective
Integrate RJSF Form component with converted JSON Schema and widget adapters, ensuring seamless transition from current custom form implementation.

## Technical Requirements

### 1. Replace ConfigForm Component
Transform current custom form into RJSF-powered form:

**Current Implementation:**
- Custom component mapping via `getComponentForField()`
- Manual field rendering with switch statements
- Category-based collapsible sections
- Custom data handling and validation

**Target Implementation:**  
- RJSF Form component with schema-driven rendering
- Widget system handles component selection
- Template system manages layout and categorization
- Native JSON Schema validation

### 2. Form Configuration Integration
```tsx
// src/components/config-form.tsx (updated)
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { widgets } from "@/form/widgets";
import FieldTemplate from "@/form/FieldTemplate";
import ObjectFieldTemplate from "@/form/ObjectFieldTemplate";
import configSchema from "@/schemas/config-schema.json";
import uiSchema from "@/schemas/ui-schema.json";

export function ConfigForm({ data, onDataChange }: ConfigFormProps) {
  return (
    <Form
      schema={configSchema}
      uiSchema={uiSchema}
      formData={data}
      widgets={widgets}
      FieldTemplate={FieldTemplate}
      ObjectFieldTemplate={ObjectFieldTemplate}
      validator={validator}
      onChange={({ formData }) => onDataChange(formData)}
      onSubmit={({ formData }) => onDataChange(formData)}
    />
  );
}
```

### 3. Data Format Compatibility
Ensure RJSF form data format matches existing ConfigData interface:
- String values for all environment variables
- Boolean handling (convert "true"/"false" strings)
- Nested object structure compatibility
- Array field serialization

## Deliverables

### Updated Components
- `src/components/config-form.tsx` - RJSF integration
- `src/types/index.ts` - Updated type definitions
- `src/utils/form-data-converter.ts` - Data format conversion utilities

### Integration Utilities
- `src/form/form-config.ts` - RJSF configuration and options
- `src/form/data-transformers.ts` - Data format converters
- `src/form/validation-config.ts` - Custom validation rules

### Legacy Cleanup
- Remove `src/schemas/generated-component-mapping.ts`
- Remove `src/schemas/generated-uiSchema.ts` 
- Remove `src/schemas/generated-schemas.ts`
- Clean up unused imports and dependencies

## Acceptance Criteria

**Functional Requirements:**
- [ ] All 370+ fields render correctly via RJSF
- [ ] Category-based organization preserved (55 categories)
- [ ] Conditional field logic functional (240 conditional fields)
- [ ] Form validation working with proper error display
- [ ] Data persistence to localStorage unchanged

**User Experience:**
- [ ] Visual appearance identical to current form
- [ ] Collapsible category sections working
- [ ] Form submission and data updates functional
- [ ] Import/export compatibility maintained
- [ ] Raw editor sync operational

**Performance:**
- [ ] Form rendering performance maintained or improved
- [ ] Initial load time comparable to current implementation
- [ ] Form interactions responsive (< 100ms)

## Implementation Steps

### Phase 1: RJSF Form Setup
1. Install and configure RJSF with validator
2. Create basic form with schema and uiSchema
3. Implement widget mapping system
4. Test basic field rendering

### Phase 2: Advanced Integration
1. Implement custom field templates
2. Configure object field template for categories
3. Add custom validation logic
4. Integrate wrapper components

### Phase 3: Data Compatibility
1. Ensure form data matches ConfigData interface
2. Implement data transformers if needed
3. Test import/export functionality
4. Verify raw editor synchronization

### Phase 4: Testing & Optimization
1. Performance optimization
2. Edge case handling
3. Error boundary implementation
4. Accessibility verification

## Data Format Considerations

### Current ConfigData Format
```typescript
interface ConfigData {
  [key: string]: string; // All values stored as strings
}
```

### RJSF Form Data Format
```typescript
// RJSF uses native types
{
  general: {
    app_settings: {
      WEBUI_URL: "http://localhost:3000",
      ENABLE_SIGNUP: true  // boolean, not string
    }
  }
}
```

### Conversion Strategy
Implement bidirectional converters:
```typescript
// Flatten RJSF nested data to ConfigData format
function rjsfToConfigData(rjsfData: any): ConfigData

// Convert flat ConfigData to RJSF nested structure  
function configDataToRjsf(configData: ConfigData): any
```

## Integration Testing

### Critical Test Scenarios
1. **Form Rendering** - All field types display correctly
2. **Category Expansion** - Collapsible sections work
3. **Conditional Logic** - Field visibility changes appropriately
4. **Validation** - Error messages show and clear correctly
5. **Data Persistence** - localStorage saves and loads properly
6. **Mode Switching** - Form ↔ raw editor sync functional
7. **Import/Export** - File operations work unchanged

## Success Metrics
- **Zero Visual Changes:** Form looks identical to current version
- **Full Functionality:** All existing features operational
- **Improved Maintainability:** Simpler codebase with RJSF
- **Schema Driven:** Form automatically updates with schema changes

## Risk Mitigation
- **Fallback Strategy:** Keep current ConfigForm as backup
- **Gradual Rollout:** Feature flag to toggle between implementations
- **Data Validation:** Extensive testing of data format compatibility
- **Performance Monitoring:** Benchmark before/after implementation

## Next Task Dependencies
- Task 019: Category Navigation System
- Task 020: Legacy Code Cleanup