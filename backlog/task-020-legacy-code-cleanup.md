# Task 020: Legacy Code Cleanup

**Priority:** Medium  
**Estimated Complexity:** Low  
**Prerequisites:** Task 018 (Form Component Integration), Task 019 (Category Navigation System)

## Context
Remove obsolete code from the custom form generation pipeline now that RJSF handles schema-driven form rendering. Clean up generated files, unused scripts, and dependencies that are no longer needed.

## Objective
Streamline the codebase by removing legacy form generation infrastructure while preserving all functional components and utilities.

## Technical Requirements

### 1. Files to Remove

#### Generated Schema Files
```bash
# Remove all generated schema artifacts
src/schemas/generated-component-mapping.ts  # ~227KB - Component mapping registry
src/schemas/generated-schemas.ts            # ~20KB - Zod schema definitions  
src/schemas/generated-uiSchema.ts          # ~728KB - UI metadata
```

#### Generation Scripts
```bash
# Remove entire script directories
scripts/openapi-to-zod/                    # Zod schema generation
scripts/generate-component-mapping/        # Component mapping generation
scripts/extract-uiSchema/                  # UI schema extraction

# Keep only the new conversion script
scripts/convert-schema.js                  # OpenAPI → JSON Schema converter
```

#### Workflow Files
```bash
# Remove complex generation pipeline
.github/workflows/form-generation-pipeline.yml

# Update build workflow to use simplified pipeline
.github/workflows/build-app.yml            # Simplify build steps
```

### 2. Dependencies to Remove

#### npm Dependencies
```bash
# Remove if no longer needed after RJSF migration
npm uninstall zod  # (if not used elsewhere)

# Keep dependencies used by components
@hookform/resolvers   # Used by existing components
react-hook-form       # Used by existing components
```

#### Development Dependencies
Review and remove any dev dependencies that were only used by generation scripts.

### 3. Code References to Update

#### Import Statement Updates
```typescript
// Remove these imports throughout codebase:
import { categories, getFieldsInCategory, fieldConfigurations } from '@/schemas/generated-uiSchema'
import { getComponentForField, getComponentProps } from '@/schemas/generated-component-mapping'
import { configSchema } from '@/schemas/generated-schemas'

// Replace with:
import configSchema from '@/schemas/config-schema.json'
import uiSchema from '@/schemas/ui-schema.json'
```

## Deliverables

### File Removal
- [ ] Delete `src/schemas/generated-*.ts` files (975KB total)
- [ ] Remove `scripts/openapi-to-zod/` directory
- [ ] Remove `scripts/generate-component-mapping/` directory  
- [ ] Remove `scripts/extract-uiSchema/` directory
- [ ] Remove `scripts/*/package.json` and `node_modules`

### Code Updates
- [ ] Update `src/components/config-form.tsx` imports
- [ ] Remove unused utility functions
- [ ] Update type definitions in `src/types/`
- [ ] Clean up `src/schemas/index.ts`

### Workflow Simplification
- [ ] Update `.github/workflows/build-app.yml`
- [ ] Remove `.github/workflows/form-generation-pipeline.yml`
- [ ] Update `package.json` scripts section
- [ ] Update README.md with new build process

### Documentation Updates
- [ ] Update `docs/PROJECT-STRUCTURE.md`
- [ ] Remove references to generation scripts in documentation
- [ ] Update build and deployment instructions

## Acceptance Criteria

**Functionality:**
- [ ] Application builds and runs without errors
- [ ] All form functionality works identically
- [ ] No broken imports or missing dependencies
- [ ] TypeScript compilation succeeds

**Clean Codebase:**
- [ ] No unused files or directories remain
- [ ] No dead code or unreachable imports
- [ ] Bundle size reduced (target: -1MB+ from removed generated files)
- [ ] Build time improved (no generation scripts)

**Documentation:**
- [ ] All documentation reflects new architecture
- [ ] Build instructions are accurate
- [ ] No references to removed scripts or files

## Implementation Steps

### Phase 1: File Inventory
1. List all files that import from generated schemas
2. Identify components and utilities that depend on generation scripts
3. Map all references to legacy code

### Phase 2: Safe Removal
1. Create backup branch before cleanup
2. Remove generated files one by one
3. Fix import errors as they appear
4. Test functionality after each major removal

### Phase 3: Workflow Cleanup  
1. Simplify GitHub Actions workflows
2. Update package.json scripts
3. Remove unused npm dependencies
4. Test full CI/CD pipeline

### Phase 4: Documentation Update
1. Update all documentation files
2. Verify README instructions work
3. Update project structure diagrams

## Safety Measures

### Backup Strategy
```bash
# Create backup branch before cleanup
git checkout -b backup/pre-legacy-cleanup
git push origin backup/pre-legacy-cleanup

# Perform cleanup on main development branch
git checkout main
```

### Incremental Approach
1. **Step 1:** Remove generated files, fix imports
2. **Step 2:** Remove generation scripts
3. **Step 3:** Remove unused dependencies
4. **Step 4:** Update workflows and documentation

### Verification Steps
After each phase:
- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` passes
- [ ] Application runs without console errors
- [ ] Form functionality tests pass

## Expected Benefits

### Codebase Simplification
- **File Reduction:** ~975KB of generated files removed
- **Script Reduction:** 3 complex generation scripts → 1 simple converter
- **Maintenance Reduction:** No more generated file management

### Build Pipeline Simplification
```yaml
# Before: Complex 3-step pipeline
- Generate Zod schemas from OpenAPI
- Extract uiSchema with 55 categories
- Generate component mapping registry
- Build application

# After: Simple direct pipeline  
- Convert OpenAPI to JSON Schema (one-time)
- Build application with RJSF
```

### Bundle Size Impact
- **Generated Files:** -975KB (not bundled but clutters repo)
- **Runtime Bundle:** Minimal change (RJSF ~50KB gzipped)
- **Build Artifacts:** Cleaner dist directory

## Risk Assessment

### Low Risk Items
- Generated file removal (not imported at runtime)
- Script directory removal (development only)
- Documentation updates (no functional impact)

### Medium Risk Items
- Dependency removal (verify no other usage)
- Import statement updates (may break builds)
- Workflow changes (could affect deployments)

### Mitigation Strategies
- Comprehensive testing after each removal phase
- Backup branches for rollback if needed
- Gradual removal with verification steps

## Success Metrics
- **Build Success:** All builds pass without errors
- **Bundle Size:** No significant bundle size increase
- **Developer Experience:** Simpler project structure
- **Maintenance:** Reduced complexity for future developers

## Next Task Dependencies
- Task 021: Enhanced Validation Pipeline
- Task 022: Build Process Optimization