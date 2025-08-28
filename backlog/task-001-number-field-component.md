# Task 001: Number Field Component

## Category: Missing Form Components

## Description
Create a NumberField component for handling numeric input with proper validation, min/max constraints, and formatting.

## Requirements
- **Numeric Input**: Handle numeric values with proper validation
- **Min/Max Constraints**: Enforce numeric range limits
- **Step Validation**: Support increment/decrement steps
- **Format Display**: Proper number formatting and display
- **Integration**: Use with existing form system and Zod validation

## Acceptance Criteria
- [ ] Component accepts numeric input only
- [ ] Validates min/max ranges
- [ ] Supports step increments
- [ ] Displays proper error messages
- [ ] Integrates with React Hook Form
- [ ] Follows existing component patterns
- [ ] Includes proper TypeScript types

## Files to Create/Modify
- `src/components/ui/form/fields/number-field.tsx`
- Update component exports and documentation

## Dependencies
- Existing form field patterns in `src/components/ui/form/fields/`
- Zod validation schemas
- shadcn/ui base components

## Implementation Notes
- Follow the pattern established by `text-field.tsx` and `select-field.tsx`
- Use HTML input type="number" with proper validation
- Include character counter if needed
- Support both integer and decimal numbers