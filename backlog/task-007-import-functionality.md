# Task 007: Import Functionality

## Category: Core Application Structure

## Description
Implement import functionality supporting file upload, drag & drop, and clipboard paste for ENV files.

## Requirements
- **File Upload**: Standard file picker for selecting files
- **Drag & Drop**: Accept files dropped onto interface
- **Clipboard Import**: Parse and process pasted ENV content
- **Format Detection**: Auto-detect ENV format from input
- **Error Handling**: Clear feedback for malformed files
- **Progress Indication**: Show processing progress

## Acceptance Criteria
- [ ] File picker opens and accepts ENV files
- [ ] Drag & drop zone accepts dropped files
- [ ] Clipboard paste detection and parsing
- [ ] Auto-detects ENV file format
- [ ] Validates imported content
- [ ] Shows processing progress
- [ ] Clear error messages for invalid files
- [ ] Merges or replaces existing configuration

## Files to Create/Modify
- `src/components/import-controls.tsx`
- `src/utils/env-parser.ts`
- `src/utils/file-handler.ts`
- Import validation utilities

## Dependencies
- File API for file reading
- ENV format parsing utilities
- Form state management
- Error handling components

## Implementation Notes
- Use File API for file reading
- Implement ENV format parser
- Support common ENV file variations
- Handle large files efficiently
- Provide clear visual feedback during import
- Support both merge and replace import modes