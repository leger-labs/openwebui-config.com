# Task 006: Mode Toggle Interface

## Category: Core Application Structure

## Description
Create a mode toggle interface that allows users to switch between form and raw editor modes with clear visual indicators.

## Requirements
- **Toggle Interface**: Switch between form and raw editor modes
- **Visual Indicators**: Clear indication of current active mode
- **Data Preservation**: Maintain data integrity during mode switches
- **Validation State**: Preserve validation state across modes
- **Accessible**: Proper keyboard navigation and screen reader support

## Acceptance Criteria
- [ ] Toggle button with clear mode indicators
- [ ] Preserves data when switching modes
- [ ] Shows current active mode clearly
- [ ] Handles validation state transitions
- [ ] Accessible keyboard navigation
- [ ] Smooth visual transitions
- [ ] Proper error handling during conversion

## Files to Create/Modify
- `src/components/mode-toggle.tsx`
- Mode conversion utilities
- Update App component integration

## Dependencies
- Main App component (Task 005)
- Form to ENV conversion utilities
- ENV to form parsing utilities

## Implementation Notes
- Use toggle buttons or tabs for mode selection
- Implement data conversion between modes
- Handle conversion errors gracefully
- Provide loading states during conversion
- Use consistent styling with application theme