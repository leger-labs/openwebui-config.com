# Task 016: Schema Conversion to Native JSON Schema

**Priority:** High  
**Estimated Complexity:** Medium  
**Prerequisites:** None (Foundation task)

## Context
Convert the current OpenAPI schema with x-extensions to native JSON Schema format, eliminating custom x-category, x-depends-on, x-provider-fields extensions in favor of standard JSON Schema features like dependencies, if/then/else, and allOf.

## Objective
Create a pure JSON Schema that RJSF can consume directly without conversion scripts.

## Technical Requirements

### 1. Schema Structure Conversion
- **Current:** OpenAPI 3.0 with nested components.schemas.OpenWebUIConfig
- **Target:** JSON Schema v7 with root-level properties

### 2. Extension Conversion Map
| Current x-extension | Native JSON Schema | Purpose |
|--|--|--|
| `x-depends-on` | `dependencies` + `if/then/else` | Conditional field visibility |
| `x-provider-fields` | `allOf` + conditional schemas | Field bundles (OpenAI, etc.) |
| `x-sensitive` | `"format": "password"` | Password field masking |
| `x-category` | Object nesting structure | Field organization |
| `x-visibility: "hidden"` | Remove from schema | Hidden fields |
| `x-display-order` | N/A (handled by uiSchema) | Field ordering |

### 3. Conditional Logic Examples
```json
// Convert x-depends-on to dependencies
"dependencies": {
  "ENABLE_OPENAI_API": {
    "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
    "then": { "required": ["OPENAI_API_KEY"] }
  }
}

// Convert x-provider-fields to allOf
"allOf": [
  {
    "if": { "properties": { "VECTOR_DB": { "const": "chroma" } } },
    "then": {
      "properties": {
        "CHROMA_HOST": { "type": "string" },
        "CHROMA_PORT": { "type": "integer" }
      }
    }
  }
]
```

## Deliverables

### Primary Files
- `schemas/config-schema.json` - Pure JSON Schema v7
- `schemas/ui-schema.json` - RJSF-compatible uiSchema
- `scripts/convert-schema.js` - One-time conversion script

### Secondary Files  
- `docs/schema-migration-log.md` - Conversion decisions and mapping log
- `schemas/legacy/` - Backup of original OpenAPI schema

## Acceptance Criteria

**Functional Requirements:**
- [ ] All 370+ fields converted to native JSON Schema
- [ ] All conditional dependencies work with JSON Schema syntax
- [ ] Schema validates with AJV validator
- [ ] No x-extensions remain in final schema

**Quality Requirements:**
- [ ] Maintains all existing field validation rules
- [ ] Preserves all conditional logic and field relationships
- [ ] Schema passes JSON Schema validation
- [ ] All enum values and defaults preserved

**Integration Requirements:**
- [ ] Compatible with RJSF form rendering
- [ ] Works with existing shadcn components via widgets
- [ ] Supports current import/export functionality

## Implementation Notes

### Nested Structure
Convert flat x-category organization to hierarchical JSON Schema objects:
```json
{
  "properties": {
    "general": {
      "type": "object",
      "properties": {
        "app_settings": {
          "properties": {
            "WEBUI_URL": { "type": "string" }
          }
        }
      }
    }
  }
}
```

### Provider Field Bundles
Current `x-provider-fields` arrays become conditional schema blocks:
```json
"allOf": [
  {
    "if": { "properties": { "ENABLE_OPENAI_API": { "const": true } } },
    "then": {
      "properties": {
        "OPENAI_API_KEY": { "type": "string", "format": "password" },
        "OPENAI_API_BASE_URL": { "type": "string", "format": "uri" }
      },
      "required": ["OPENAI_API_KEY"]
    }
  }
]
```

## Success Metrics
- **Schema Size:** ~5.6k lines → Similar size
- **Field Count:** 370 fields preserved
- **Categories:** 55 categories → Hierarchical objects
- **Validation:** 100% AJV compatibility
- **Dependencies:** All 240 conditional fields functional

## Next Task Dependencies
- Task 017: RJSF Widget Adapter Implementation
- Task 018: Form Component Integration