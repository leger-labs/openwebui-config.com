Current directory structure:
└── leger-labs-openwebui-config.com/
    ├── docs/
    │   ├── CLOUDFLARE-RULES.md
    │   ├── COMPONENTS.md
    │   ├── deployment-files.md
    │   ├── FEATURE-REQUREMENTS.md
    │   ├── IMPLEMENTATION-PLAN.md
    │   ├── IMPLEMENTATION-SUMMARY.md
    │   ├── PROJECT-OVERVIEW.md
    │   ├── PROJECT-STRUCTURE.md
    │   ├── SCHEMA-DESIGN.md
    │   └── TECHNICAL-INFRASTRUCTURE.md
    ├── scripts/
    │   ├── extract-uiSchema/
    │   │   ├── README.md
    │   │   ├── category-builder.js
    │   │   ├── dependency-processor.js
    │   │   ├── extension-extractor.js
    │   │   ├── index.js
    │   │   ├── output-formatter.js
    │   │   ├── package.json
    │   │   ├── schema-parser.js
    │   │   └── uiSchema-builder.js
    │   ├── generate-component-mapping/
    │   │   ├── README.md
    │   │   ├── component-mapping-config.js
    │   │   ├── index.js
    │   │   ├── mapping-generator.js
    │   │   ├── output-formatter.js
    │   │   ├── package.json
    │   │   └── schema-reader.js
    │   └── openapi-to-zod/
    │       ├── README.md
    │       ├── index.js
    │       ├── package.json
    │       └── zod-processor.js
    ├── src/
    │   ├── components/
    │   │   ├── theme-provider.tsx
    │   │   └── ui/
    │   │       ├── accordion.tsx
    │   │       ├── alert-dialog.tsx
    │   │       ├── alert.tsx
    │   │       ├── aspect-ratio.tsx
    │   │       ├── avatar.tsx
    │   │       ├── badge.tsx
    │   │       ├── breadcrumb.tsx
    │   │       ├── button.tsx
    │   │       ├── calendar.tsx
    │   │       ├── card.tsx
    │   │       ├── carousel.tsx
    │   │       ├── chart.tsx
    │   │       ├── checkbox.tsx
    │   │       ├── collapsible.tsx
    │   │       ├── command.tsx
    │   │       ├── context-menu.tsx
    │   │       ├── dialog.tsx
    │   │       ├── drawer.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       ├── form.tsx
    │   │       ├── hover-card.tsx
    │   │       ├── input-otp.tsx
    │   │       ├── input.tsx
    │   │       ├── label.tsx
    │   │       ├── menubar.tsx
    │   │       ├── navigation-menu.tsx
    │   │       ├── pagination.tsx
    │   │       ├── popover.tsx
    │   │       ├── progress.tsx
    │   │       ├── radio-group.tsx
    │   │       ├── resizable.tsx
    │   │       ├── scroll-area.tsx
    │   │       ├── select.tsx
    │   │       ├── separator.tsx
    │   │       ├── sheet.tsx
    │   │       ├── sidebar.tsx
    │   │       ├── skeleton.tsx
    │   │       ├── slider.tsx
    │   │       ├── sonner.tsx
    │   │       ├── switch.tsx
    │   │       ├── table.tsx
    │   │       ├── tabs.tsx
    │   │       ├── textarea.tsx
    │   │       ├── toast.tsx
    │   │       ├── toaster.tsx
    │   │       ├── toggle-group.tsx
    │   │       ├── toggle.tsx
    │   │       ├── tooltip.tsx
    │   │       ├── use-mobile.tsx
    │   │       ├── use-toast.ts
    │   │       ├── api/
    │   │       │   └── permission-scope-row.tsx
    │   │       ├── docs/
    │   │       │   ├── code-reference.tsx
    │   │       │   └── documentation-link.tsx
    │   │       ├── env-vars/
    │   │       │   ├── environment-variable-form.tsx
    │   │       │   ├── environment-variable-import.tsx
    │   │       │   └── environment-variable-table.tsx
    │   │       ├── environments/
    │   │       │   ├── environment-breadcrumb.tsx
    │   │       │   └── environment-card.tsx
    │   │       ├── form/
    │   │       │   ├── feedback/
    │   │       │   │   ├── character-counter.tsx
    │   │       │   │   ├── dangerous-action-button.tsx
    │   │       │   │   ├── save-button.tsx
    │   │       │   │   ├── toast-error.tsx
    │   │       │   │   ├── validation-message.tsx
    │   │       │   │   └── visibility-notice.tsx
    │   │       │   ├── fields/
    │   │       │   │   ├── array-field.tsx
    │   │       │   │   ├── markdown-text-area.tsx
    │   │       │   │   ├── same-information-checkbox.tsx
    │   │       │   │   ├── secret-field.tsx
    │   │       │   │   ├── select-field.tsx
    │   │       │   │   ├── text-field.tsx
    │   │       │   │   ├── toggle-field.tsx
    │   │       │   │   └── url-input.tsx
    │   │       │   ├── layouts/
    │   │       │   │   ├── category-section.tsx
    │   │       │   │   ├── field-group.tsx
    │   │       │   │   └── form-section.tsx
    │   │       │   └── wrappers/
    │   │       │       ├── conditional-field.tsx
    │   │       │       ├── overrideable-field.tsx
    │   │       │       └── plan-restricted-feature.tsx
    │   │       ├── framework/
    │   │       │   ├── command-field-group.tsx
    │   │       │   ├── framework-icon.tsx
    │   │       │   └── framework-preset-selector.tsx
    │   │       ├── navigation/
    │   │       │   ├── hierarchical-navigation.tsx
    │   │       │   └── section-accordion.tsx
    │   │       ├── path-management/
    │   │       │   └── path-management-list.tsx
    │   │       ├── protection/
    │   │       │   └── protection-mode-selector.tsx
    │   │       └── team/
    │   │           └── team-selector-chip.tsx
    │   └── schemas-original-output-from-gh-action/
    │       ├── generated-schemas.ts
    │       └── index.ts
    └── .github/
        ├── claude.yml
        ├── form-generation-pipeline.yml
        └── form-generation-pipeline.yml.old
