# Task 005: Main Application Component

## Category: Core Application Structure

## Description
Create the root App component that orchestrates the entire application, including mode switching, state management, and layout.

## Requirements
- **Root Component**: Main application wrapper and coordinator
- **Mode Management**: Handle switching between form and raw editor modes
- **State Management**: Manage global application state
- **Layout Structure**: Provide consistent application layout
- **Error Boundaries**: Handle and display application errors gracefully

## Acceptance Criteria
- [ ] App component serves as application root
- [ ] Manages form vs raw editor mode state
- [ ] Provides global error handling
- [ ] Implements consistent layout structure
- [ ] Manages localStorage integration
- [ ] Handles application initialization
- [ ] Proper TypeScript interfaces

## Files to Create/Modify
- `src/App.tsx`
- `src/main.tsx` (if needed)
- Application-level types and interfaces

## Dependencies
- Mode toggle component (Task 006)
- Import/export controls (Tasks 007-008)
- Form components and raw editor
- localStorage utilities

## Implementation Notes
- Use React.useState for mode management
- Implement error boundaries for graceful error handling
- Structure layout with header, main content, and controls
- Initialize from localStorage on app load
- Provide context for shared state if needed