current directory structure for this repo

Directory structure:
└── leger-labs-openwebui-config.com/
    ├── CLAUDE.md
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── wrangler.toml
    ├── .eslintrc.cjs
    ├── .prettierrc
    ├── backlog/
    │   ├── README.md
    │   ├── task-001-number-field-component.md
    │   ├── task-002-integer-field-component.md
    │   ├── task-003-object-field-component.md
    │   ├── task-004-date-field-component.md
    │   ├── task-005-main-application-component.md
    │   ├── task-006-mode-toggle-interface.md
    │   ├── task-007-import-functionality.md
    │   ├── task-008-export-functionality.md
    │   ├── task-009-raw-text-editor.md
    │   ├── task-010-localstorage-integration.md
    │   ├── task-011-validation-system.md
    │   ├── task-012-format-converters.md
    │   ├── task-013-project-configuration.md
    │   └── task-014-cloudflare-workers-deployment.md
    ├── docs/
    │   ├── README.md
    │   ├── CLOUDFLARE-RULES.md
    │   ├── COMPONENTS.md
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
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   ├── components/
    │   │   ├── config-form.tsx
    │   │   ├── export-controls.tsx
    │   │   ├── import-controls.tsx
    │   │   ├── mode-toggle.tsx
    │   │   ├── raw-editor.tsx
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
    │   │       │   │   ├── date-field.tsx
    │   │       │   │   ├── integer-field.tsx
    │   │       │   │   ├── markdown-text-area.tsx
    │   │       │   │   ├── number-field.tsx
    │   │       │   │   ├── object-field.tsx
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
    │   ├── hooks/
    │   │   ├── use-local-storage.ts
    │   │   ├── use-mobile.tsx
    │   │   ├── use-toast.ts
    │   │   └── use-validation.ts
    │   ├── lib/
    │   │   └── utils.ts
    │   ├── schemas/
    │   │   ├── generated-schemas.ts
    │   │   └── index.ts
    │   ├── types/
    │   │   ├── index.ts
    │   │   └── storage.ts
    │   └── utils/
    │       ├── env-converter.ts
    │       ├── env-formatter.ts
    │       ├── env-generator.ts
    │       ├── env-parser.ts
    │       ├── storage.ts
    │       └── validation.ts
    └── .github/
        └── workflows/
            ├── build-app.yml
            ├── claude.yml
            └── form-generation-pipeline.yml
