// Export all schema-related modules
export * from './generated-schemas'
export * from './generated-uiSchema'

// Explicit exports from component mapping to avoid conflicts
export { 
  type ComponentMapping,
  type ComponentProps,
  type AvailableComponent,
  type AvailableWrapper,
  type ComponentRegistry,
  type IntegrationMetadata,
  type OpenWebUIComponentMappings,
  componentMappings as formComponentMappings, // Rename to avoid conflict
  componentProps as formComponentProps, // Rename to avoid conflict
  fieldWrappers,
  integrationMetadata as formIntegrationMetadata, // Rename to avoid conflict
  getComponentForField,
  getComponentProps as getFormComponentProps, // Rename to avoid conflict  
  getFieldWrappers,
  getAlternativeComponents,
  isConditionalField as isFormConditionalField, // Rename to avoid conflict
  isPremiumField,
  getFieldsUsingComponent,
  getComponentUsageStats,
  getFieldsByCategory,
  hasComponentMapping,
  getComponentDecisionPath,
  getComponentDecisionReason,
  createReactTsFormConfig,
  validateComponentMappings,
  openWebUIComponentMappings
} from './generated-component-mapping'
