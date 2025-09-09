Overall goals:
New approach should reduce custom tooling, leverage mature form frameworks, and provide a fully automated “single-source-of-truth → code → deploy” pipeline.


- Leverage conditional dependencies (`dependencies` in JSON Schema) for showing/hiding fields.


- Continue using shadcn-inspired components—but import them from a shared UI package, not LLM dumps.
- Define form field wrappers (TextInput, Select, Checkbox) once in a UI toolkit; let the form library handle layout.

- One workflow job for gh actions:
1. Checkout
2. `npm ci`
3. `npm run build`
4. `wrangler publish`

---

conditional logic/validation:

- Leverage the form library’s `ui:rule` settings or JSON Schema’s `if/then/else` for environment-specific toggles (e.g., “only show GPU options when `USE_GPU=true`”).

- **Built-in validation**: Handles all validation logic from your schema > no need for zod validation schemas

---

Rather than rolling your own form engine, you can leverage **React JSON Schema Form (RJSF)** and map its inputs to refined shadcn primitives. Keep all your custom `ui/form/fields` and `ui/form/layouts` while offloading schema-driven rendering, conditional logic, and validation.

---

# converting existing /src/components

prefer Option B: Separate Repositories

1. Publish `ui-kit` to your private or public npm registry:

```
cd ui-kit
npm publish --access=public   // or private
```

2. In your SPA project, install the package:

```
npm install @your-org/ui-kit
```

3. Import as above.

## 4. Integrate with Your Form Library

With your shared UI components in place, configure your form renderer (e.g., React JSON Schema Form or react-hook-form) to use them:

```tsx
import { useForm } from 'react-hook-form';
import { TextInput, Select } from '@your-org/ui-kit';

function EnvForm() {
  const { register, handleSubmit, formState } = useForm(/*…*/);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="API Key"
        {...register('API_KEY', { required: true })}
        error={formState.errors.API_KEY?.message}
      />
      <Select
        label="Log Level"
        options={['debug','info','warn','error']}
        {...register('LOG_LEVEL')}
      />
      {/* … */}
    </form>
  );
}
``

Based on the `/docs` materials you provided, you already have clear definitions and patterns for your form– and layout–related components, coding conventions, and project structure. Here’s how you can repurpose them to jump-start a standalone UI kit.

## Component Inventory from COMPONENTS.md

COMPONENTS.md lists every form field, wrapper, layout, feedback, navigation, and miscellaneous UI component currently used. You can use this as the **source of truth** for which primitives to extract into `@your-org/ui-kit`:

Use this list to scaffold `ui-kit/src/fields/…`, `ui-kit/src/wrappers/…`, `ui-kit/src/layouts/…`, and so on.
```


Existing **RJSF Compatibility**: Standard uiSchema properties (ui:widget, ui:options, etc.)

# Simplifying Your Three-Step Pipeline with RJSF

By examining your pipeline docs, here’s how each script fits—and how you can collapse most of it if you leverage **React JSON Schema Form (RJSF)** end‐to‐end:

| Step                              | Current Purpose                                                                                       | RJSF‐Based Simplification                                     |
|-----------------------------------|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| **1. OpenAPI → Zod**              | Generates Zod schemas (validation) and TypeScript types                                                | _Keep_ for client-side parsing/validation, or replace with RJSF’s AJV validator if you prefer JSON Schema–only validation. |
| **2. OpenAPI → uiSchema**         | Extracts `x-` UI metadata into an RJSF-compatible uiSchema file                                        | _Keep_, but output directly as the `uiSchema` you’ll pass to `<Form>`. No additional mapping needed.     |
| **3. Component Mapping Generator**| Applies design rules to pick shadcn components for each field, emitting a TS registry of component names | _Remove_. RJSF’s `widgets` and `FieldTemplate` hooks let you map types → your existing shadcn components at render time. |

***

## How to Wire RJSF Directly

1. **Produce two artifacts** from your schema:
   - `jsonSchema` (the OpenAPI schema’s `components.schemas.OpenWebUIConfig.properties`)
   - `uiSchema` (your extracted `x-` metadata)

2. **Install RJSF**  
   ```bash
   npm install @rjsf/core @rjsf/validator-ajv8
   ```

3. **Create a `widgets.tsx` adapter** mapping JSON Schema types to your shadcn form fields:  
   ```tsx
   // src/form/widgets.tsx
   import { TextField } from "@/components/ui/form/fields/text-field";
   import { SecretField } from "@/components/ui/form/fields/secret-field";
   import { ToggleField } from "@/components/ui/form/fields/toggle-field";
   import { SelectField } from "@/components/ui/form/fields/select-field";
   import { ArrayField } from "@/components/ui/form/fields/array-field";
   import { URLInput } from "@/components/ui/form/fields/url-input";
   import { MarkdownTextArea } from "@/components/ui/form/fields/markdown-text-area";

   export const widgets = {
     BaseInput: TextField,
     password: SecretField,
     checkbox: ToggleField,
     select: SelectField,
     textarea: MarkdownTextArea,
     url: URLInput,
     // For arrays, register a custom FieldTemplate or use ArrayField via Template
   };
   ```

4. **Compose your Form** in `ConfigForm.tsx`:
   ```tsx
   import Form from "@rjsf/core";
   import validator from "@rjsf/validator-ajv8";
   import { widgets } from "./form/widgets";
   import uiSchema from "@/schemas/generated-uiSchema";    // step 2 output
   import jsonSchema from "@/schemas/openwebui-json-schema"; // trimmed to properties

   export function ConfigForm() {
     function handleSubmit({ formData }: { formData: any }) {
       console.log("Validated config:", formData);
     }

     return (
       <Form
         schema={jsonSchema}
         uiSchema={uiSchema}
         widgets={widgets}
         validator={validator}
         onSubmit={handleSubmit}
       />
     );
   }
   ```

5. **Drop the Component-Mapping Step**  
   All conditional logic, field grouping, and component selection now flows through:
   - `uiSchema.dependencies` for show/hide  
   - RJSF’s built-in `FieldTemplate` and `ObjectFieldTemplate` for layouts  
   - Your `widgets` mapping to shadcn components  

---

Re: widget creation
Instead of creating `src/form/widgets.tsx` mapping JSON Schema widget names to your shadcn fields; we change the schema naming to follow uiSchema convention

---

### CI/CD Automation Strategy

1. **Schema Repository**  
   - Store your JSON Schema (with `x-` UI metadata) in Git.  
   - Version it alongside code.

2. **Code Generation Pipeline**  
   - On push to `main` (or a schema change path), trigger CI workflow.  
   - Steps:
     1. **Checkout**  
     2. **Install** dependencies  
     3. **Generate** form artifacts:
        - using RJSF: no generation—UI driven directly from schema + uiSchema.  
     4. **Build** SPA with Vite targeting Cloudflare Workers.  
     5. **Deploy** via `wrangler deploy` or Cloudflare Pages.

3. **Atomic Releases**  
   - Use schema commit hash as version tag.  
   - Deploy artifacts only when generation & build succeed.

4. **Validation & Tests**  
   - Include schema linting (e.g., `ajv-cli --validate`).  


Note: integration with shadcn components **RJSF**: Map each schema widget type to your shadcn field via `widgets` and layout via `FieldTemplate`/`ObjectFieldTemplate`.  

---

## Current Schema Analysis

Your schema contains excellent metadata that maps perfectly to RJSF:

| Your `x-` Extension | RJSF `uiSchema` Equivalent | Purpose |
|---------------------|----------------------------|---------|
| `x-depends-on` | `dependencies` in JSON Schema | Conditional field visibility |
| `x-provider-fields` | `dependencies` + `uiSchema` | Field bundles (e.g., OpenAI fields) |
| `x-sensitive` | `ui:widget: "password"` | Sensitive field masking |
| `x-category` | `ui:group` or object nesting | Field organization |
| `x-display-order` | `ui:order` | Field ordering |
| `x-visibility` | `ui:widget: "hidden"` | Hide/show fields |
| `default` values | Native JSON Schema `default` | Default values |

***

## Required Transformations

### 1. Convert OpenAPI Structure to JSON Schema

**Current (OpenAPI format):**
```json
{
  "openapi": "3.0.0",
  "components": {
    "schemas": {
      "OpenWebUIConfig": {
        "type": "object",
        "properties": { /* your 380 fields */ }
      }
    }
  }
}
```

**Target (JSON Schema format):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": { /* your 380 fields */ },
  "dependencies": { /* converted from x-depends-on */ }
}
```

### 2. Convert `x-depends-on` to JSON Schema `dependencies`

**Your current format:**
```json
"OPENAI_API_KEY": {
  "type": "string",
  "x-depends-on": {
    "ENABLE_OPENAI_API": true
  }
}
```

**Converted to JSON Schema:**
```json
{
  "properties": {
    "OPENAI_API_KEY": {
      "type": "string"
    }
  },
  "dependencies": {
    "OPENAI_API_KEY": {
      "properties": {
        "ENABLE_OPENAI_API": { "const": true }
      }
    }
  }
}
```

### 3. Convert `x-provider-fields` to Conditional Dependencies

**Your current bundling:**
```json
"ENABLE_OPENAI_API": {
  "type": "boolean",
  "x-provider-fields": [
    "OPENAI_API_BASE_URL",
    "OPENAI_API_KEY",
    "OPENAI_API_KEYS"
  ]
}
```

**Converted to JSON Schema dependencies:**
```json
{
  "dependencies": {
    "ENABLE_OPENAI_API": {
      "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
      "then": {
        "required": ["OPENAI_API_KEY"],
        "properties": {
          "OPENAI_API_BASE_URL": { "type": "string" },
          "OPENAI_API_KEY": { "type": "string" },
          "OPENAI_API_KEYS": { "type": "string" }
        }
      }
    }
  }
}
```

***

## Generated `uiSchema` from Your `x-` Extensions

```json
{
  "ui:order": ["WEBUI_URL", "ENABLE_SIGNUP", "ENABLE_LOGIN_FORM", /*...sorted by x-display-order*/],
  
  "WEBUI_URL": {
    "ui:widget": "hidden",
    "ui:description": "Specifies the URL where the Open WebUI is reachable"
  },
  
  "OPENAI_API_KEY": {
    "ui:widget": "password",
    "ui:placeholder": "Enter your OpenAI API key",
    "ui:help": "Required for OpenAI integration"
  },
  
  "VECTOR_DB": {
    "ui:widget": "SelectWidget",
    "ui:options": {
      "enumOptions": [
        { "value": "chroma", "label": "ChromaDB" },
        { "value": "elasticsearch", "label": "Elasticsearch" },
        { "value": "milvus", "label": "Milvus" }
      ]
    }
  },
  
  "DEFAULT_USER_ROLE": {
    "ui:widget": "RadioWidget",
    "ui:options": {
      "inline": true
    }
  }
}
```

***

## Conversion Script Outline

You can automate this transformation with a script

---

Re: Existing components
Requires standardization, some components use Radix/Shadcn whereas others use standard .tsx format
Aim to reduce dependencies; specificlaly next js (prefer pure react components for browser-native performance)

---

    ! rjsf-compatible custom components mapping high-level analysis
    
## Direct Component Mapping

Based on your existing components in `src/components/ui/form/`, here's how they map to RJSF widgets:

### Basic Field Widgets
```tsx
// src/form/widgets.tsx
import { TextField } from "@/components/ui/form/fields/text-field";
import { SecretField } from "@/components/ui/form/fields/secret-field";
import { ToggleField } from "@/components/ui/form/fields/toggle-field";
import { SelectField } from "@/components/ui/form/fields/select-field";
import { ArrayField } from "@/components/ui/form/fields/array-field";
import { URLInput } from "@/components/ui/form/fields/url-input";
import { MarkdownTextArea } from "@/components/ui/form/fields/markdown-text-area";

export const widgets = {
  TextWidget: TextField,           // string fields
  PasswordWidget: SecretField,     // x-sensitive: true fields  
  CheckboxWidget: ToggleField,     // boolean fields
  SelectWidget: SelectField,       // enum fields
  TextareaWidget: MarkdownTextArea, // multiline text
  URLWidget: URLInput,             // x-format: "uri" fields
  // Note: ArrayField requires special handling via FieldTemplate
};
```

### Layout Components via Templates
```tsx
// src/form/FieldTemplate.tsx
import { FieldGroup } from "@/components/ui/form/layouts/field-group";
import { ValidationMessage } from "@/components/ui/form/feedback/validation-message";
import { CharacterCounter } from "@/components/ui/form/feedback/character-counter";

export default function FieldTemplate(props: FieldProps) {
  const { id, label, required, children, rawErrors, schema } = props;
  
  return (
    <FieldGroup label={label} required={required}>
      {children}
      {schema.maxLength && <CharacterCounter current={value?.length} max={schema.maxLength} />}
      {rawErrors && <ValidationMessage errors={rawErrors} />}
    </FieldGroup>
  );
}
```

### Category/Section Layout
```tsx
// src/form/ObjectFieldTemplate.tsx
import { CategorySection } from "@/components/ui/form/layouts/category-section";
import { FormSection } from "@/components/ui/form/layouts/form-section";

export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { title, properties, uiSchema } = props;
  
  // Group properties by x-category from your schema
  const categoryGroups = groupPropertiesByCategory(properties);
  
  return (
    <>
      {Object.entries(categoryGroups).map(([category, fields]) => (
        <CategorySection key={category} title={category}>
          <FormSection>
            {fields.map(field => field.content)}
          </FormSection>
        </CategorySection>
      ))}
    </>
  );
}
```

***

## Wrapper Components Integration

Your existing wrapper components can be integrated through custom field templates:

### Conditional Field Wrapper
```tsx
// src/form/custom-fields/ConditionalFieldWrapper.tsx
import { ConditionalField } from "@/components/ui/form/wrappers/conditional-field";

export function ConditionalFieldWrapper(props: FieldProps) {
  const { formData, schema, uiSchema } = props;
  
  // RJSF handles the conditional logic via dependencies
  // ConditionalField just provides the visual wrapper
  return (
    <ConditionalField condition={true}> {/* Always true - RJSF controls visibility */}
      <DefaultFieldTemplate {...props} />
    </ConditionalField>
  );
}
```

### Plan-Restricted Features
```tsx
// Apply via uiSchema
{
  "OPENAI_API_KEY": {
    "ui:field": "PlanRestrictedField",
    "ui:widget": "PasswordWidget"
  }
}

// src/form/custom-fields/PlanRestrictedField.tsx
import { PlanRestrictedFeature } from "@/components/ui/form/wrappers/plan-restricted-feature";

export function PlanRestrictedField(props: FieldProps) {
  return (
    <PlanRestrictedFeature planRequired="pro">
      <DefaultFieldTemplate {...props} />
    </PlanRestrictedFeature>
  );
}
```

***

## Advanced Component Integration

### Your SaveButton Component
```tsx
// src/form/SubmitButton.tsx
import { SaveButton } from "@/components/ui/form/feedback/save-button";

export function CustomSubmitButton({ formData, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  return (
    <SaveButton 
      isLoading={isLoading}
      isDirty={isDirty}
      onClick={() => {
        setIsLoading(true);
        onSubmit(formData);
      }}
    >
      Generate .env File
    </SaveButton>
  );
}
```

### Your ArrayField Component
```tsx
// Handle arrays via custom field
export function CustomArrayField(props: FieldProps) {
  const { ArrayField } = await import("@/components/ui/form/fields/array-field");
  
  return (
    <ArrayField
      items={props.formData || []}
      onAdd={(item) => props.onChange([...props.formData, item])}
      onRemove={(index) => props.onChange(props.formData.filter((_, i) => i !== index))}
      label={props.schema.title}
    />
  );
}
```

***

## Complete Integration Example

```tsx
// src/components/config-form.tsx
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { widgets } from "@/form/widgets";
import FieldTemplate from "@/form/FieldTemplate";
import ObjectFieldTemplate from "@/form/ObjectFieldTemplate";
import { CustomSubmitButton } from "@/form/SubmitButton";

export function ConfigForm() {
  const [formData, setFormData] = useState({});
  
  return (
    <Form
      schema={jsonSchema}          // Your converted JSON Schema
      uiSchema={uiSchema}          // Your converted uiSchema
      formData={formData}
      widgets={widgets}            // Your shadcn components
      FieldTemplate={FieldTemplate}
      ObjectFieldTemplate={ObjectFieldTemplate}
      validator={validator}
      onChange={({ formData }) => setFormData(formData)}
      onSubmit={({ formData }) => generateEnvFile(formData)}
    >
      <CustomSubmitButton />
    </Form>
  );
}
```

***

## Key Benefits

1. **Zero Component Rewrites**: Your existing shadcn components work as-is
2. **Preserved Logic**: All your validation, error handling, and UX refinements remain
3. **Enhanced Functionality**: RJSF adds schema-driven conditional logic automatically
4. **Simplified Maintenance**: No more custom component-mapping scripts to maintain

Your investment in refined shadcn components is fully preserved—RJSF just becomes the orchestration layer that handles the complex conditional rendering based on your schema metadata.

---

# RJSF + uiSchema: The Complete Picture

## How uiSchema Works with RJSF

**RJSF operates with two schemas:**

1. **JSON Schema** - Defines data structure, types, validation rules, and conditional logic
2. **uiSchema** - Defines presentation layer: which components to use, how to display them, ordering, grouping, etc.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   JSON Schema   │    │    uiSchema      │    │  Your shadcn    │
│                 │    │                  │    │   Components    │
│ • Data types    │    │ • Widget choice  │    │                 │
│ • Validation    │ -> │ • Field order    │ -> │ • TextField     │
│ • Dependencies  │    │ • CSS classes    │    │ • SecretField   │
│ • Defaults      │    │ • Help text      │    │ • SelectField   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                    ↓
                            ┌──────────────────┐
                            │   Rendered       │
                            │   Form with      │
                            │   Conditional    │
                            │   Logic          │
                            └──────────────────┘
```

---

# DESIGN DECISION: Migrate away from openapi-spec single source of truth. Explained below:

## Native JSON Schema Approach

### Replace `x-depends-on` with Native `dependencies`

**Instead of:**
```json
"OPENAI_API_KEY": {
  "type": "string",
  "x-depends-on": {
    "ENABLE_OPENAI_API": true
  }
}
```

**Use native JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "ENABLE_OPENAI_API": { "type": "boolean", "default": false },
    "OPENAI_API_KEY": { "type": "string" },
    "OPENAI_API_BASE_URL": { "type": "string" }
  },
  "dependencies": {
    "ENABLE_OPENAI_API": {
      "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
      "then": {
        "properties": {
          "OPENAI_API_KEY": { "type": "string" },
          "OPENAI_API_BASE_URL": { "type": "string" }
        }
      }
    }
  }
}
```

### Replace `x-provider-fields` with Native Conditional Schema

**Instead of:**
```json
"VECTOR_DB": {
  "enum": ["chroma", "pinecone", "elasticsearch"],
  "x-provider-fields": {
    "chroma": ["CHROMA_HOST", "CHROMA_PORT"],
    "pinecone": ["PINECONE_API_KEY", "PINECONE_ENVIRONMENT"]
  }
}
```

**Use native JSON Schema oneOf:**
```json
{
  "properties": {
    "VECTOR_DB": {
      "enum": ["chroma", "pinecone", "elasticsearch"]
    }
  },
  "allOf": [
    {
      "if": { "properties": { "VECTOR_DB": { "const": "chroma" } } },
      "then": {
        "properties": {
          "CHROMA_HOST": { "type": "string", "default": "localhost" },
          "CHROMA_PORT": { "type": "integer", "default": 8000 }
        },
        "required": ["CHROMA_HOST"]
      }
    },
    {
      "if": { "properties": { "VECTOR_DB": { "const": "pinecone" } } },
      "then": {
        "properties": {
          "PINECONE_API_KEY": { "type": "string" },
          "PINECONE_ENVIRONMENT": { "type": "string" }
        },
        "required": ["PINECONE_API_KEY"]
      }
    }
  ]
}
```

### Replace `x-` Extensions with Native JSON Schema + uiSchema

| Your `x-` Extension | Native JSON Schema | uiSchema |
|---------------------|-------------------|-----------|
| `x-sensitive: true` | `"format": "password"` | `"ui:widget": "PasswordWidget"` |
| `x-visibility: "hidden"` | *(remove from schema)* | `"ui:widget": "hidden"` |
| `x-category` | *(group in schema structure)* | `"ui:group": "categoryName"` |
| `x-display-order` | *(not needed)* | `"ui:order": [...]` |
| `x-rationale` | `"description"` | `"ui:help"` |

***

## Your New Single Source of Truth Structure

**`schemas/config-schema.json`:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "OpenWebUI Configuration",
  
  "properties": {
    "WEBUI_URL": {
      "type": "string",
      "default": "http://localhost:3000",
      "description": "URL where Open WebUI is reachable"
    },
    
    "ENABLE_SIGNUP": {
      "type": "boolean", 
      "default": true,
      "description": "Toggles user account creation"
    },
    
    "ENABLE_OPENAI_API": {
      "type": "boolean",
      "default": false,
      "description": "Enables OpenAI API integration"
    },
    
    "OPENAI_API_KEY": {
      "type": "string",
      "format": "password",
      "description": "Your OpenAI API key"
    },
    
    "VECTOR_DB": {
      "type": "string",
      "enum": ["chroma", "pinecone", "elasticsearch"],
      "default": "chroma",
      "description": "Vector database system to use"
    },
    
    "CHROMA_HOST": {
      "type": "string",
      "default": "localhost"
    },
    
    "PINECONE_API_KEY": {
      "type": "string", 
      "format": "password"
    }
  },
  
  "dependencies": {
    "ENABLE_OPENAI_API": {
      "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
      "then": {
        "required": ["OPENAI_API_KEY"],
        "properties": {
          "OPENAI_API_KEY": true,
          "OPENAI_API_BASE_URL": { "type": "string", "default": "https://api.openai.com/v1" }
        }
      }
    }
  },
  
  "allOf": [
    {
      "if": { "properties": { "VECTOR_DB": { "const": "chroma" } } },
      "then": {
        "properties": {
          "CHROMA_HOST": true,
          "CHROMA_PORT": { "type": "integer", "default": 8000 }
        }
      }
    },
    {
      "if": { "properties": { "VECTOR_DB": { "const": "pinecone" } } },
      "then": {
        "properties": {
          "PINECONE_API_KEY": true,
          "PINECONE_ENVIRONMENT": { "type": "string" }
        }
      }
    }
  ]
}
```

**`schemas/ui-schema.json`:**
```json
{
  "ui:order": [
    "WEBUI_URL", 
    "ENABLE_SIGNUP", 
    "ENABLE_OPENAI_API", 
    "OPENAI_API_KEY",
    "VECTOR_DB",
    "CHROMA_HOST",
    "PINECONE_API_KEY"
  ],
  
  "WEBUI_URL": {
    "ui:widget": "hidden"
  },
  
  "OPENAI_API_KEY": {
    "ui:widget": "PasswordWidget",
    "ui:placeholder": "sk-...",
    "ui:help": "Get this from platform.openai.com"
  },
  
  "VECTOR_DB": {
    "ui:widget": "SelectWidget",
    "ui:help": "Choose your vector database provider"
  },
  
  "CHROMA_HOST": {
    "ui:widget": "URLWidget"
  },
  
  "PINECONE_API_KEY": {
    "ui:widget": "PasswordWidget"
  }
}
```

***

## Simplified Workflow

### No Conversion Script Needed

**Your GitHub Action becomes:**
```yaml
name: Deploy Config Form

on:
  push:
    paths:
      - 'schemas/config-schema.json'
      - 'schemas/ui-schema.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Build & Deploy
        run: |
          npm install
          npm run build  # Vite reads schemas directly
          npx wrangler pages deploy dist
```

### Direct RJSF Integration

**Your form component:**
```tsx
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { widgets } from "@/form/widgets";
import configSchema from "@/schemas/config-schema.json";
import uiSchema from "@/schemas/ui-schema.json";

export function ConfigForm() {
  return (
    <Form
      schema={configSchema}    // Direct JSON Schema - no conversion
      uiSchema={uiSchema}      // Direct uiSchema - no generation
      widgets={widgets}        // Your shadcn components
      validator={validator}
      onSubmit={generateEnvFile}
    />
  );
}
```

***

## Key Benefits

1. **No conversion scripts** - JSON Schema is your source of truth
2. **Native validation** - JSON Schema + AJV handles all validation
3. **Native dependencies** - Built-in conditional logic with `if/then/else`
4. **Standards compliant** - Pure JSON Schema, works with any JSON Schema tooling
5. **Simpler maintenance** - Fewer moving parts, no custom `x-` extensions
6. **Better tooling** - JSON Schema has excellent editor support, validation, etc.

This approach eliminates the conversion step entirely—you write native JSON Schema with conditional logic, and RJSF consumes it directly with your shadcn components.

---

[Continued] NOTE: The analysis below is boilerplate code, make sure to go through existing codebase and map concepts directly. 

## Advanced RJSF Architecture with Your Components

### 1. Sidebar Navigation with Section Management

**Create a master layout using your `HierarchicalNavigation`:**

```tsx
// src/components/ConfigFormLayout.tsx
import { HierarchicalNavigation } from "@/components/ui/navigation/hierarchical-navigation";
import { SectionAccordion } from "@/components/ui/navigation/section-accordion";
import { CategorySection } from "@/components/ui/form/layouts/category-section";

export function ConfigFormLayout({ 
  categories, 
  currentSection, 
  onSectionChange,
  children 
}) {
  const navigationItems = categories.map(category => ({
    id: category.slug,
    label: category.name,
    children: category.subsections?.map(sub => ({
      id: sub.slug,
      label: sub.name
    }))
  }));
  
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-80 border-r bg-muted/40 p-6 overflow-y-auto">
        <HierarchicalNavigation
          items={navigationItems}
          activeId={currentSection}
          onNavigate={onSectionChange}
        />
      </aside>
      
      {/* Main Form Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
);
}

```

### 2. Advanced ObjectFieldTemplate with Category Grouping

**This is where your components shine:**

```tsx
// src/form/templates/CategoryObjectTemplate.tsx
import { CategorySection } from "@/components/ui/form/layouts/category-section";
import { FormSection } from "@/components/ui/form/layouts/form-section";
import { SectionAccordion } from "@/components/ui/navigation/section-accordion";
import { SaveButton } from "@/components/ui/form/feedback/save-button";

export function CategoryObjectTemplate(props: ObjectFieldTemplateProps) {
  const { properties, formData, onChange } = props;
  
  // Group properties by x-category from your original schema concept
  const categoryGroups = groupPropertiesByCategory(properties);
  
  return (
    <>
      {Object.entries(categoryGroups).map(([categoryName, fields]) => (
        <CategorySection
          key={categoryName}
          title={categoryName}
          description={getCategoryDescription(categoryName)}
          onSave={(data) => handleCategorySave(categoryName, data)}
        >
          <SectionAccordion 
            sections={fields.map(field => ({
              title: field.name,
              content: (
                <FormSection>
                  {field.content}
                </FormSection>
              )
            }))}
          />
        </CategorySection>
      ))}
    </>
  );
}
```


### 3. Complex Field Templates with Your Wrappers

**Conditional and plan-restricted fields:**

```tsx
// src/form/templates/AdvancedFieldTemplate.tsx
import { FieldGroup } from "@/components/ui/form/layouts/field-group";
import { ConditionalField } from "@/components/ui/form/wrappers/conditional-field";
import { PlanRestrictedFeature } from "@/components/ui/form/wrappers/plan-restricted-feature";
import { OverrideableField } from "@/components/ui/form/wrappers/overrideable-field";
import { ValidationMessage } from "@/components/ui/form/feedback/validation-message";
import { CharacterCounter } from "@/components/ui/form/feedback/character-counter";
import { VisibilityNotice } from "@/components/ui/form/feedback/visibility-notice";

export function AdvancedFieldTemplate(props: FieldTemplateProps) {
  const { 
    id, label, required, description, children, rawErrors, 
    schema, uiSchema, formData, disabled 
  } = props;
  
  // Extract metadata from schema/uiSchema
  const isPlanRestricted = uiSchema?.["ui:planRequired"];
  const hasOverride = uiSchema?.["ui:overrideable"];
  const isPublic = uiSchema?.["ui:visibility"] === "public";
  const maxLength = schema.maxLength;
  
  let fieldContent = children;
  
  // Wrap with appropriate containers
  if (hasOverride) {
    fieldContent = (
      <OverrideableField 
        defaultValue={schema.default}
        onOverride={(isOverridden) => handleOverride(id, isOverridden)}
      >
        {fieldContent}
      </OverrideableField>
    );
  }
  
  if (isPlanRestricted) {
    fieldContent = (
      <PlanRestrictedFeature planRequired={isPlanRestricted}>
        {fieldContent}
      </PlanRestrictedFeature>
    );
  }
  
  return (
    <ConditionalField condition={!disabled}>
      <FieldGroup label={label} required={required}>
        {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
        {fieldContent}
        
        {/* Rich feedback */}
        <div className="flex items-center justify-between mt-2">
          {maxLength && (
            <CharacterCounter 
              current={formData?.length || 0} 
              max={maxLength} 
            />
          )}
          {isPublic && <VisibilityNotice isPublic />}
        </div>
        
        {rawErrors && <ValidationMessage errors={rawErrors} />}
      </FieldGroup>
    </ConditionalField>
  );
}
```


### 4. Nested Schema Structure for Complex Forms

**Your JSON Schema can be deeply nested:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "general": {
      "type": "object",
      "title": "General Settings",
      "properties": {
        "app_settings": {
          "type": "object", 
          "title": "Application",
          "properties": {
            "WEBUI_URL": { "type": "string" },
            "ENABLE_SIGNUP": { "type": "boolean" }
          }
        },
        "security": {
          "type": "object",
          "title": "Security",
          "properties": {
            "WEBUI_AUTH": { "type": "boolean" },
            "JWT_EXPIRES_IN": { "type": "integer" }
          }
        }
      }
    },
    "integrations": {
      "type": "object",
      "title": "External Integrations",
      "properties": {
        "openai": {
          "type": "object",
          "title": "OpenAI Configuration",
          "properties": {
            "ENABLE_OPENAI_API": { "type": "boolean" },
            "OPENAI_API_KEY": { "type": "string", "format": "password" }
          },
          "dependencies": {
            "OPENAI_API_KEY": {
              "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
              "then": { "required": ["OPENAI_API_KEY"] }
            }
          }
        },
        "vector_db": {
          "type": "object",
          "title": "Vector Database",
          "properties": {
            "VECTOR_DB": {
              "enum": ["chroma", "pinecone", "elasticsearch"],
              "default": "chroma"
            }
          },
          "allOf": [
            {
              "if": { "properties": { "VECTOR_DB": { "const": "chroma" } } },
              "then": {
                "properties": {
                  "chroma_settings": {
                    "type": "object",
                    "properties": {
                      "CHROMA_HOST": { "type": "string" },
                      "CHROMA_PORT": { "type": "integer" }
                    }
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}
```


### 5. Master uiSchema with Advanced Layout

```json
{
  "ui:ObjectFieldTemplate": "CategoryObjectTemplate",
  "ui:FieldTemplate": "AdvancedFieldTemplate",
  
  "general": {
    "ui:ObjectFieldTemplate": "SectionObjectTemplate",
    "app_settings": {
      "ui:title": "🚀 Application Settings",
      "ui:collapsible": true,
      "WEBUI_URL": {
        "ui:widget": "hidden"
      },
      "ENABLE_SIGNUP": {
        "ui:widget": "CheckboxWidget",
        "ui:help": "Allow new users to register accounts"
      }
    },
    "security": {
      "ui:title": "🔒 Security Configuration",
      "ui:collapsible": true,
      "ui:planRequired": "enterprise"
    }
  },
  
  "integrations": {
    "ui:ObjectFieldTemplate": "IntegrationObjectTemplate", 
    "openai": {
      "ui:title": "🤖 OpenAI Integration",
      "ui:documentation": "https://docs.openwebui.com/openai",
      "OPENAI_API_KEY": {
        "ui:widget": "PasswordWidget",
        "ui:placeholder": "sk-...",
        "ui:help": "Get your API key from platform.openai.com"
      }
    },
    "vector_db": {
      "ui:title": "📊 Vector Database",
      "VECTOR_DB": {
        "ui:widget": "SelectWidget",
        "ui:enumOptions": [
          { "value": "chroma", "label": "ChromaDB (Recommended)" },
          { "value": "pinecone", "label": "Pinecone (Cloud)" },
          { "value": "elasticsearch", "label": "Elasticsearch" }
        ]
      }
    }
  }
}
```


### 6. Integration with Your Environment Variable Management

```tsx
// src/components/ConfigForm.tsx
import Form from "@rjsf/core";
import { EnvironmentVariableTable } from "@/components/ui/env-vars/environment-variable-table";
import { DocumentationLink } from "@/components/ui/docs/documentation-link";

export function ConfigForm() {
  const [generatedEnvVars, setGeneratedEnvVars] = useState([]);
  
  const handleSubmit = ({ formData }) => {
    const envVars = flattenToEnvVars(formData);
    setGeneratedEnvVars(envVars);
  };
  
  return (
    <ConfigFormLayout 
      categories={extractCategories(schema)}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      <Form
        schema={configSchema}
        uiSchema={advancedUiSchema}
        widgets={yourWidgets}
        templates={{
          ObjectFieldTemplate: CategoryObjectTemplate,
          FieldTemplate: AdvancedFieldTemplate
        }}
        onSubmit={handleSubmit}
      >
        <SaveButton>Generate Configuration</SaveButton>
      </Form>
      
      {generatedEnvVars.length > 0 && (
        <CategorySection title="Generated Environment Variables">
          <EnvironmentVariableTable 
            variables={generatedEnvVars}
            onDownload={downloadEnvFile}
          />
          <DocumentationLink 
            href="https://docs.openwebui.com/deployment"
            text="Deployment Guide"
          />
        </CategorySection>
      )}
    </ConfigFormLayout>
  );
}
```

---


GOAL: Convert the analysis below into detailed, documented expected format. Idea is to go from "environment variables" .md file from official OWUI repo to full json schema (as described above) but leveraging all the config options listed below
Based on research, **combining JSON Schema with UI extensions in a single file is a well-established pattern**. 

## Current `x-` Extensions Analysis

### Keep (Direct JSON Schema Equivalents)

| Current `x-` | JSON Schema Native | Purpose |
| :-- | :-- | :-- |
| `x-depends-on` | `dependencies` + `if/then/else` | Conditional field logic |
| `default` values | `default` | Field defaults |
| `enum` | `enum` | Select options |
| `x-sensitive` | `"format": "password"` | Password fields |

### Transform (Move to uiSchema)

| Current `x-` | uiSchema Equivalent | Component Benefit |
| :-- | :-- | :-- |
| `x-category` | `ui:group` + nested objects | Perfect for `CategorySection` organization |
| `x-display-order` | `ui:order` | Form field sequencing |
| `x-visibility` | `ui:widget: "hidden"` | Conditional visibility |
| `x-rationale` | `ui:help` | Context help integration |

### Add New (Missing Capabilities)

| New Concept | uiSchema Property | Your Component | Benefit |
| :-- | :-- | :-- | :-- |
| Plan restrictions | `ui:planRequired` | `PlanRestrictedFeature` | Enterprise feature gating |
| Override capability | `ui:overrideable` | `OverrideableField` | Default value overriding |
| Documentation links | `ui:documentation` | `DocumentationLink` | Context-sensitive help |
| Character limits | `ui:showCharCount` | `CharacterCounter` | Input feedback |
| Visibility status | `ui:visibility` | `VisibilityNotice` | Public/private indicators |
| Field grouping | `ui:collapsible` | `SectionAccordion` | Collapsible sections |
| Array management | `ui:arrayOptions` | `ArrayField` | Rich list management |


***

## Target JSON Schema Structure

### Master Schema Format

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://schemas.openwebui.com/config/v1",
  "title": "OpenWebUI Configuration Schema",
  "description": "Complete configuration schema for OpenWebUI deployment",
  "type": "object",
  
  "properties": {
    "general": {
      "type": "object",
      "title": "General Settings",
      "description": "Core application configuration",
      "properties": {
        "app_basics": {
          "type": "object",
          "title": "Application Basics",
          "properties": {
            "WEBUI_URL": {
              "type": "string",
              "format": "uri",
              "default": "http://localhost:3000",
              "description": "URL where Open WebUI is reachable"
            },
            "WEBUI_NAME": {
              "type": "string",
              "default": "Open WebUI",
              "maxLength": 50,
              "description": "Display name for the application"
            },
            "DEFAULT_LOCALE": {
              "type": "string",
              "enum": ["en", "es", "fr", "de", "ja", "zh"],
              "default": "en",
              "description": "Default language for the interface"
            }
          }
        },
        "user_management": {
          "type": "object", 
          "title": "User Management",
          "properties": {
            "ENABLE_SIGNUP": {
              "type": "boolean",
              "default": true,
              "description": "Allow new user registrations"
            },
            "DEFAULT_USER_ROLE": {
              "type": "string",
              "enum": ["pending", "user", "admin"],
              "default": "pending",
              "description": "Default role for new users"
            }
          }
        }
      }
    },
    
    "security": {
      "type": "object",
      "title": "Security Configuration",
      "description": "Authentication and security settings", 
      "properties": {
        "authentication": {
          "type": "object",
          "title": "Authentication",
          "properties": {
            "WEBUI_AUTH": {
              "type": "boolean",
              "default": true,
              "description": "Enable authentication system"
            },
            "WEBUI_SECRET_KEY": {
              "type": "string",
              "format": "password",
              "minLength": 32,
              "description": "Secret key for JWT signing"
            }
          },
          "dependencies": {
            "WEBUI_SECRET_KEY": {
              "if": { "properties": { "WEBUI_AUTH": { "const": true } } },
              "then": { "required": ["WEBUI_SECRET_KEY"] }
            }
          }
        }
      }
    },
    
    "integrations": {
      "type": "object",
      "title": "External Integrations",
      "description": "Third-party service configurations",
      "properties": {
        "ai_providers": {
          "type": "object",
          "title": "AI Providers",
          "properties": {
            "openai": {
              "type": "object",
              "title": "OpenAI Configuration",
              "properties": {
                "ENABLE_OPENAI_API": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable OpenAI integration"
                },
                "OPENAI_API_KEY": {
                  "type": "string",
                  "format": "password",
                  "pattern": "^sk-[A-Za-z0-9]{48}$",
                  "description": "OpenAI API key"
                },
                "OPENAI_API_BASE_URL": {
                  "type": "string",
                  "format": "uri",
                  "default": "https://api.openai.com/v1",
                  "description": "OpenAI API endpoint"
                }
              },
              "allOf": [
                {
                  "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
                  "then": { "required": ["OPENAI_API_KEY"] }
                }
              ]
            }
          }
        },
        
        "storage": {
          "type": "object",
          "title": "Storage Providers",
          "properties": {
            "STORAGE_PROVIDER": {
              "type": "string",
              "enum": ["local", "s3", "gcs", "azure"],
              "default": "local",
              "description": "File storage backend"
            }
          },
          "allOf": [
            {
              "if": { "properties": { "STORAGE_PROVIDER": { "const": "s3" } } },
              "then": {
                "properties": {
                  "s3_config": {
                    "type": "object",
                    "title": "S3 Configuration",
                    "properties": {
                      "S3_BUCKET_NAME": { "type": "string" },
                      "S3_ACCESS_KEY_ID": { "type": "string", "format": "password" },
                      "S3_SECRET_ACCESS_KEY": { "type": "string", "format": "password" },
                      "S3_REGION_NAME": { "type": "string", "default": "us-east-1" },
                      "S3_ENDPOINT_URL": { "type": "string", "format": "uri" }
                    },
                    "required": ["S3_BUCKET_NAME", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"]
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}
```


***

## Target uiSchema Structure

### Complete uiSchema Format

```json
{
  "$schema": "https://schemas.openwebui.com/ui-schema/v1",
  "ui:title": "OpenWebUI Configuration",
  "ui:description": "Configure your OpenWebUI deployment",
  "ui:ObjectFieldTemplate": "CategoryObjectTemplate",
  "ui:FieldTemplate": "AdvancedFieldTemplate",
  "ui:submitButtonOptions": {
    "submitText": "Generate Configuration",
    "norender": false,
    "props": {
      "className": "w-full"
    }
  },
  
  "general": {
    "ui:ObjectFieldTemplate": "SectionObjectTemplate",
    "ui:title": "⚙️ General Settings",
    "ui:collapsible": true,
    "ui:defaultExpanded": true,
    "ui:order": ["app_basics", "user_management"],
    
    "app_basics": {
      "ui:title": "🚀 Application Basics",
      "ui:collapsible": true,
      "ui:order": ["WEBUI_NAME", "WEBUI_URL", "DEFAULT_LOCALE"],
      
      "WEBUI_NAME": {
        "ui:widget": "TextWidget",
        "ui:placeholder": "My OpenWebUI Instance",
        "ui:showCharCount": true,
        "ui:help": "This name appears in the browser tab and header"
      },
      
      "WEBUI_URL": {
        "ui:widget": "URLWidget",
        "ui:placeholder": "https://my-openwebui.com",
        "ui:help": "The URL where users will access your instance",
        "ui:documentation": "https://docs.openwebui.com/deployment/url-configuration"
      },
      
      "DEFAULT_LOCALE": {
        "ui:widget": "SelectWidget",
        "ui:enumOptions": [
          { "value": "en", "label": "🇺🇸 English" },
          { "value": "es", "label": "🇪🇸 Español" },
          { "value": "fr", "label": "🇫🇷 Français" },
          { "value": "de", "label": "🇩🇪 Deutsch" },
          { "value": "ja", "label": "🇯🇵 日本語" },
          { "value": "zh", "label": "🇨🇳 中文" }
        ]
      }
    },
    
    "user_management": {
      "ui:title": "👥 User Management",
      "ui:collapsible": true,
      "ui:order": ["ENABLE_SIGNUP", "DEFAULT_USER_ROLE"],
      
      "ENABLE_SIGNUP": {
        "ui:widget": "CheckboxWidget",
        "ui:help": "When enabled, users can create accounts themselves"
      },
      
      "DEFAULT_USER_ROLE": {
        "ui:widget": "RadioWidget",
        "ui:options": { "inline": false },
        "ui:enumOptions": [
          { "value": "pending", "label": "Pending (Requires admin approval)" },
          { "value": "user", "label": "User (Immediate access)" },
          { "value": "admin", "label": "Admin (Full permissions)" }
        ]
      }
    }
  },
  
  "security": {
    "ui:ObjectFieldTemplate": "SectionObjectTemplate", 
    "ui:title": "🔒 Security Configuration",
    "ui:collapsible": true,
    "ui:planRequired": "pro",
    "ui:order": ["authentication"],
    
    "authentication": {
      "ui:title": "🔐 Authentication",
      "ui:collapsible": true,
      "ui:order": ["WEBUI_AUTH", "WEBUI_SECRET_KEY"],
      
      "WEBUI_AUTH": {
        "ui:widget": "CheckboxWidget",
        "ui:help": "Disable only if using external authentication",
        "ui:documentation": "https://docs.openwebui.com/security/authentication"
      },
      
      "WEBUI_SECRET_KEY": {
        "ui:widget": "PasswordWidget",
        "ui:placeholder": "Generate a secure random string",
        "ui:showCharCount": true,
        "ui:help": "Used to sign JWT tokens. Keep this secret!",
        "ui:generateButton": true,
        "ui:overrideable": true
      }
    }
  },
  
  "integrations": {
    "ui:ObjectFieldTemplate": "IntegrationObjectTemplate",
    "ui:title": "🔌 External Integrations", 
    "ui:collapsible": true,
    "ui:order": ["ai_providers", "storage"],
    
    "ai_providers": {
      "ui:title": "🤖 AI Providers",
      "ui:collapsible": true,
      "ui:order": ["openai"],
      
      "openai": {
        "ui:title": "OpenAI",
        "ui:collapsible": true,
        "ui:order": ["ENABLE_OPENAI_API", "OPENAI_API_KEY", "OPENAI_API_BASE_URL"],
        "ui:documentation": "https://docs.openwebui.com/integrations/openai",
        
        "ENABLE_OPENAI_API": {
          "ui:widget": "CheckboxWidget",
          "ui:help": "Enable GPT-4, GPT-3.5, and other OpenAI models"
        },
        
        "OPENAI_API_KEY": {
          "ui:widget": "PasswordWidget",
          "ui:placeholder": "sk-...",
          "ui:help": "Get your API key from platform.openai.com",
          "ui:planRequired": "basic",
          "ui:validation": {
            "pattern": "^sk-[A-Za-z0-9]{48}$",
            "message": "OpenAI API keys start with 'sk-' and are 51 characters long"
          }
        },
        
        "OPENAI_API_BASE_URL": {
          "ui:widget": "URLWidget", 
          "ui:help": "Custom endpoint for OpenAI-compatible APIs",
          "ui:overrideable": true
        }
      }
    },
    
    "storage": {
      "ui:title": "💾 Storage Configuration",
      "ui:collapsible": true,
      "ui:order": ["STORAGE_PROVIDER", "s3_config"],
      
      "STORAGE_PROVIDER": {
        "ui:widget": "SelectWidget",
        "ui:enumOptions": [
          { "value": "local", "label": "🗄️ Local File System" },
          { "value": "s3", "label": "☁️ Amazon S3 / Compatible" },
          { "value": "gcs", "label": "☁️ Google Cloud Storage" },
          { "value": "azure", "label": "☁️ Azure Blob Storage" }
        ],
        "ui:help": "Where to store uploaded files and data"
      },
      
      "s3_config": {
        "ui:title": "S3 Configuration",
        "ui:collapsible": true,
        "ui:order": ["S3_BUCKET_NAME", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_REGION_NAME", "S3_ENDPOINT_URL"],
        "ui:documentation": "https://docs.openwebui.com/storage/s3",
        
        "S3_BUCKET_NAME": {
          "ui:widget": "TextWidget",
          "ui:placeholder": "my-openwebui-bucket",
          "ui:help": "S3 bucket name (must already exist)"
        },
        
        "S3_ACCESS_KEY_ID": {
          "ui:widget": "PasswordWidget",
          "ui:placeholder": "AKIA...",
          "ui:help": "AWS Access Key ID"
        },
        
        "S3_SECRET_ACCESS_KEY": {
          "ui:widget": "PasswordWidget", 
          "ui:help": "AWS Secret Access Key"
        },
        
        "S3_REGION_NAME": {
          "ui:widget": "SelectWidget",
          "ui:enumOptions": [
            { "value": "us-east-1", "label": "US East (N. Virginia)" },
            { "value": "us-west-2", "label": "US West (Oregon)" },
            { "value": "eu-west-1", "label": "Europe (Ireland)" },
            { "value": "ap-southeast-1", "label": "Asia Pacific (Singapore)" }
          ]
        },
        
        "S3_ENDPOINT_URL": {
          "ui:widget": "URLWidget",
          "ui:placeholder": "https://s3.amazonaws.com",
          "ui:help": "Custom S3 endpoint (for S3-compatible services)",
          "ui:overrideable": true
        }
      }
    }
  }
}
```


***

## New uiSchema Properties You Should Add

### Component Integration Properties

```json
{
  "ui:planRequired": "basic|pro|enterprise",  // PlanRestrictedFeature
  "ui:overrideable": true,                    // OverrideableField 
  "ui:showCharCount": true,                   // CharacterCounter
  "ui:documentation": "https://...",          // DocumentationLink
  "ui:visibility": "public|private",          // VisibilityNotice
  "ui:collapsible": true,                     // SectionAccordion
  "ui:defaultExpanded": true,                 // Default accordion state
  "ui:generateButton": true,                  // Auto-generate values
  "ui:validation": {                          // ValidationMessage enhancement
    "pattern": "regex",
    "message": "custom message"
  },
  "ui:arrayOptions": {                        // ArrayField configuration
    "addText": "Add Item",
    "removeText": "Remove",
    "reorderable": true
  }
}
```

---


## Proven Approaches from Real Projects
### 1. Custom `x-ui-*` Extensions (Recommended for You)
**Selected approach** - extend JSON Schema with your UI properties using `x-ui-` prefix:

### 2. Split During Build (Your Conversion Script)

**Simple conversion script that splits your unified schema:**

```javascript
// scripts/split-schema.js
function splitUnifiedSchema(unifiedSchema) {
  const jsonSchema = JSON.parse(JSON.stringify(unifiedSchema));
  const uiSchema = { "ui:order": unifiedSchema["x-ui-order"] || [] };
  
  // Extract x-ui-categories to create ObjectFieldTemplate structure  
  if (unifiedSchema["x-ui-categories"]) {
    uiSchema["ui:categories"] = unifiedSchema["x-ui-categories"];
    delete jsonSchema["x-ui-categories"];
  }
  
  // Process each property
  function processProperties(schemaProps, uiSchemaPath) {
    Object.entries(schemaProps).forEach(([fieldName, fieldDef]) => {
      const uiField = {};
      
      // Extract x-ui-* properties
      Object.entries(fieldDef).forEach(([key, value]) => {
        if (key.startsWith('x-ui-')) {
          const uiKey = `ui:${key.substring(4)}`;
          uiField[uiKey] = value;
          delete fieldDef[key];  // Remove from JSON Schema
        }
      });
      
      // Set uiSchema if we found UI properties
      if (Object.keys(uiField).length > 0) {
        uiSchemaPath[fieldName] = uiField;
      }
      
      // Handle nested objects recursively
      if (fieldDef.type === 'object' && fieldDef.properties) {
        if (!uiSchemaPath[fieldName]) uiSchemaPath[fieldName] = {};
        processProperties(fieldDef.properties, uiSchemaPath[fieldName]);
      }
    });
  }
  
  processProperties(jsonSchema.properties, uiSchema);
  
  // Clean up root-level x-ui properties
  delete jsonSchema["x-ui-order"];
  
  return { jsonSchema, uiSchema };
}

// Usage in your build process
const unifiedSchema = require('../schemas/openwebui-config.json');
const { jsonSchema, uiSchema } = splitUnifiedSchema(unifiedSchema);

fs.writeFileSync('src/schemas/json-schema.json', JSON.stringify(jsonSchema, null, 2));
fs.writeFileSync('src/schemas/ui-schema.json', JSON.stringify(uiSchema, null, 2));
```


## Simplified GitHub Workflow

### Single Source, No Conversion Needed

```yaml
name: Deploy Config Form
on:
  push:
    paths: ['schemas/openwebui-config.json']  # Single source of truth

jobs:
  deploy:
    steps:
      - uses: actions/checkout@v4
      - name: Split Schema  
        run: node scripts/split-schema.js  # 10-line script
      - name: Build & Deploy
        run: |
          npm run build
          npx wrangler pages deploy dist
```

---


## Summary: What You're Actually Changing

**Keep (95% of work preserved):**

- ✅ All your shadcn components
- ✅ Cloudflare Workers setup
- ✅ Build and deployment process
- ✅ Project structure

**Change (Simplified architecture):**

- ❌ Remove custom form generation scripts → Simple 15-line split script
- ❌ Remove Zod schemas → Pure JSON Schema validation
- ❌ Remove component mapping → RJSF widgets system
- ✅ Single unified schema file → Your source of truth

**Net result:** Your project becomes **significantly simpler** while preserving all your investment in components and infrastructure. The schema file becomes your only maintenance point, and everything else is generated automatically.
