# Task 009: Raw Text Editor

## Category: Core Application Structure

## Description
Implement a raw text editor using HTML textarea for direct ENV file editing with validation and formatting.

## Requirements
- **HTML Textarea**: Simple text editing interface
- **ENV Format Support**: Parse and validate ENV format
- **Syntax Validation**: Real-time validation feedback
- **Auto-formatting**: Basic formatting improvements
- **Bidirectional Sync**: Convert to/from form data

## Acceptance Criteria
- [ ] HTML textarea for raw text editing
- [ ] Real-time ENV syntax validation
- [ ] Visual error indicators
- [ ] Auto-formatting for readability
- [ ] Sync with form mode data
- [ ] Handles large configuration files
- [ ] Proper error messaging

## Files to Create/Modify
- `src/components/raw-editor.tsx`
- `src/utils/env-validator.ts`
- `src/utils/env-formatter.ts`
- Syntax highlighting utilities (optional)

## Dependencies
- ENV parsing and validation utilities
- Form data conversion utilities
- Validation display components

## Implementation Notes
- Use HTML textarea element for simplicity
- Implement ENV syntax validation
- Consider basic syntax highlighting
- Handle large files efficiently
- Provide clear error indicators
- Auto-resize textarea based on content
- Support undo/redo functionality