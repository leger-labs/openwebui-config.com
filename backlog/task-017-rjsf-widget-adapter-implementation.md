# Task 017: RJSF Widget Adapter Implementation

**Priority:** High  
**Estimated Complexity:** Medium  
**Prerequisites:** Task 016 (Schema Conversion)

## Context
Create widget adapters that connect React JSON Schema Form (RJSF) to existing shadcn/ui components, preserving all current form field functionality while leveraging RJSF's schema-driven rendering.

## Objective
Implement RJSF integration layer that maps JSON Schema field types to existing shadcn components without rewriting any components.

## Technical Requirements

### 1. RJSF Dependencies
```bash
npm install @rjsf/core @rjsf/validator-ajv8
```

### 2. Widget Mapping Architecture
Map JSON Schema types to existing components:
```tsx
// src/form/widgets.tsx
import { TextField } from "@/components/ui/form/fields/text-field";
import { SecretField } from "@/components/ui/form/fields/secret-field";
import { ToggleField } from "@/components/ui/form/fields/toggle-field";
import { SelectField } from "@/components/ui/form/fields/select-field";

export const widgets = {
  TextWidget: TextField,           // string fields
  PasswordWidget: SecretField,     // format: "password" 
  CheckboxWidget: ToggleField,     // boolean fields
  SelectWidget: SelectField,       // enum fields
  URLWidget: URLInput,             // format: "uri"
  TextareaWidget: MarkdownTextArea // multiline strings
};
```

### 3. Custom Field Templates
Integrate existing wrapper components:
```tsx
// src/form/FieldTemplate.tsx
import { FieldGroup } from "@/components/ui/form/layouts/field-group";
import { ValidationMessage } from "@/components/ui/form/feedback/validation-message";
import { CharacterCounter } from "@/components/ui/form/feedback/character-counter";

export default function FieldTemplate(props: FieldTemplateProps) {
  return (
    <FieldGroup label={props.label} required={props.required}>
      {props.children}
      {props.schema.maxLength && <CharacterCounter />}
      {props.rawErrors && <ValidationMessage errors={props.rawErrors} />}
    </FieldGroup>
  );
}
```

## Deliverables

### Core Files
- `src/form/widgets.tsx` - Widget mapping registry
- `src/form/FieldTemplate.tsx` - Custom field template
- `src/form/ObjectFieldTemplate.tsx` - Category-based object template
- `src/form/ArrayFieldTemplate.tsx` - Array field handling

### Integration Files
- `src/form/custom-fields/` - Wrapper component integrations
  - `ConditionalFieldWrapper.tsx` - ConditionalField integration
  - `PlanRestrictedField.tsx` - PlanRestrictedFeature integration
  - `OverrideableField.tsx` - OverrideableField integration

### Configuration Files
- `src/form/rjsf-config.ts` - RJSF configuration and theme
- `src/form/custom-validators.ts` - Additional validation logic

## Acceptance Criteria

**Component Integration:**
- [ ] All 12 existing field components work via RJSF widgets
- [ ] Wrapper components (ConditionalField, PlanRestrictedFeature) integrated
- [ ] Layout components (FieldGroup, CategorySection) functional
- [ ] Feedback components (ValidationMessage, CharacterCounter) working

**Form Functionality:**
- [ ] Schema-driven form generation working
- [ ] Conditional field logic operational
- [ ] Validation messages display correctly
- [ ] Form data binding and updates functional

**Visual Consistency:**
- [ ] Forms look identical to current implementation
- [ ] All styling and theming preserved
- [ ] Component animations and transitions working
- [ ] Responsive design maintained

## Implementation Details

### Widget Component Adapter Pattern
Each widget adapter wraps existing components to match RJSF expectations:

```tsx
// Example: TextField adapter
function TextFieldWidget(props: WidgetProps) {
  const { id, value, onChange, label, placeholder, disabled, readonly } = props;
  
  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled || readonly}
    />
  );
}
```

### ObjectFieldTemplate for Categories
Use existing CategorySection component:
```tsx
export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { title, properties } = props;
  
  return (
    <CategorySection title={title}>
      <FormSection>
        {properties.map(element => element.content)}
      </FormSection>
    </CategorySection>
  );
}
```

### Array Field Handling
Integrate existing ArrayField component:
```tsx
export default function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const { items, onAddClick, canAdd, title } = props;
  
  return (
    <ArrayField
      items={items}
      onAdd={onAddClick}
      canAdd={canAdd}
      label={title}
    />
  );
}
```

## Integration Testing

### Test Cases
1. **Basic Field Rendering** - All field types render correctly
2. **Conditional Logic** - Fields show/hide based on dependencies  
3. **Validation** - Error messages display and clear appropriately
4. **Data Binding** - Form values update in sync with state
5. **Import/Export** - Existing functionality works with RJSF forms

### Compatibility Verification
- [ ] localStorage persistence unchanged
- [ ] Raw editor sync functional
- [ ] Export formats identical
- [ ] Import parsing compatible

## Success Metrics
- **Zero Component Rewrites:** All existing shadcn components unchanged
- **Full Feature Parity:** All current form features working
- **Performance:** Form rendering speed maintained or improved
- **Bundle Size:** Minimal increase (RJSF adds ~50kb gzipped)

## Next Task Dependencies
- Task 018: Form Component Integration
- Task 019: Category Navigation System