import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Form from '@rjsf/core'
import { RJSFSchema, UiSchema, IChangeEvent } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle, Eye, EyeOff, Settings, Search, ChevronDown, ChevronRight } from 'lucide-react'
import configSchemaRaw from '@/schemas/config-schema.json'
import uiSchemaRaw from '@/schemas/ui-schema.json'
import type { ConfigData } from '@/types'
import { configDataToRjsf, rjsfToConfigData } from '@/form/data-transformers'
import widgets from '@/form/widgets'
import SimpleFieldTemplate from '@/form/SimpleFieldTemplate'
import SimpleObjectFieldTemplate from '@/form/SimpleObjectFieldTemplate'
import SimpleArrayFieldTemplate from '@/form/SimpleArrayFieldTemplate'
import { cn } from '@/lib/utils'

interface ConfigFormRJSFProps {
  data: ConfigData
  onDataChange: (data: ConfigData) => void
  className?: string // Restored className prop
}

export function ConfigFormRJSF({ data, onDataChange, className }: ConfigFormRJSFProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any[]>([])
  const [isValid, setIsValid] = useState(true)
  const [showHiddenFields, setShowHiddenFields] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [schemaError, setSchemaError] = useState<string | null>(null)

  // Dynamically restructure schema with better error handling
  const configSchema = useMemo(() => {
    try {
      const schema = JSON.parse(JSON.stringify(configSchemaRaw))
      
      // Ensure schema has required structure
      if (!schema.properties) {
        console.error('Schema missing properties field')
        setSchemaError('Invalid schema structure: missing properties')
        return configSchemaRaw as RJSFSchema
      }
      
      // More robust handling of oauth and ldap sections
      // Check if oauth exists in ui-schema but not in config schema
      if (uiSchemaRaw.oauth && schema.properties.security) {
        if (!schema.properties.security.properties) {
          schema.properties.security.properties = {}
        }
        // Only add if it doesn't already exist
        if (!schema.properties.security.properties.oauth) {
          schema.properties.security.properties.oauth = {
            type: 'object',
            title: 'OAuth Configuration',
            properties: extractPropertiesFromUiSchema(uiSchemaRaw.oauth)
          }
        }
      }
      
      // Same for LDAP
      if (uiSchemaRaw.ldap && schema.properties.security) {
        if (!schema.properties.security.properties) {
          schema.properties.security.properties = {}
        }
        if (!schema.properties.security.properties.ldap) {
          schema.properties.security.properties.ldap = {
            type: 'object',
            title: 'LDAP Configuration',
            properties: extractPropertiesFromUiSchema(uiSchemaRaw.ldap)
          }
        }
      }
      
      setSchemaError(null)
      return schema as RJSFSchema
    } catch (error) {
      console.error('Failed to process schema:', error)
      setSchemaError('Failed to process configuration schema')
      return configSchemaRaw as RJSFSchema
    }
  }, [])

  // Helper function to extract properties from UI schema
  const extractPropertiesFromUiSchema = useCallback((uiSchemaSection: any): any => {
    const properties: any = {}
    
    if (uiSchemaSection && uiSchemaSection.properties) {
      Object.keys(uiSchemaSection.properties).forEach(key => {
        if (!key.startsWith('ui:')) {
          properties[key] = {
            type: 'string',
            title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          }
        }
      })
    }
    
    return properties
  }, [])

  // Dynamically get top-level properties from schema with error handling
  const topLevelProperties = useMemo(() => {
    try {
      return Object.keys(configSchema.properties || {}).filter(key => {
        // Filter based on search query
        if (!searchQuery) return true
        return key.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (configSchema.properties?.[key]?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      })
    } catch (error) {
      console.error('Failed to extract top-level properties:', error)
      return []
    }
  }, [configSchema, searchQuery])

  // Process UI schema to handle hidden fields toggle with enhanced error handling
  const processedUiSchema = useMemo(() => {
    try {
      const processSchema = (schema: any, path: string[] = []): any => {
        if (!schema || typeof schema !== 'object') return schema
        
        const processed: any = {}
        
        for (const [key, value] of Object.entries(schema)) {
          if (key === 'ui:widget' && value === 'hidden') {
            if (showHiddenFields) {
              // Convert hidden widget to text widget when showing hidden fields
              processed[key] = 'TextWidget'
              // Preserve existing help text or add new one
              if (!processed['ui:help']) {
                processed['ui:help'] = '(Advanced Setting)'
              }
            } else {
              // Keep hidden
              processed[key] = value
            }
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            // Recursively process nested objects
            processed[key] = processSchema(value, [...path, key])
          } else {
            processed[key] = value
          }
        }
        
        return processed
      }
      
      // Start with the raw UI schema
      let uiSchema = JSON.parse(JSON.stringify(uiSchemaRaw))
      
      // Move oauth and ldap under security in UI schema if they exist at root level
      if (uiSchema.oauth) {
        if (!uiSchema.security) uiSchema.security = {}
        uiSchema.security.oauth = uiSchema.oauth
        delete uiSchema.oauth
      }
      
      if (uiSchema.ldap) {
        if (!uiSchema.security) uiSchema.security = {}
        uiSchema.security.ldap = uiSchema.ldap
        delete uiSchema.ldap
      }
      
      // Process the schema to handle hidden fields
      const processed = processSchema(uiSchema)
      
      // Dynamically set ui:order based on actual schema properties
      processed['ui:order'] = topLevelProperties
      
      // Add collapsible UI hints for better UX
      topLevelProperties.forEach(prop => {
        if (processed[prop] && typeof processed[prop] === 'object') {
          processed[prop]['ui:collapsible'] = true
          processed[prop]['ui:collapsed'] = !expandedSections.has(prop)
        }
      })
      
      return processed as UiSchema
    } catch (error) {
      console.error('Failed to process UI schema:', error)
      return uiSchemaRaw as UiSchema
    }
  }, [showHiddenFields, topLevelProperties, expandedSections])

  // Count hidden fields for the toggle label with error handling
  const hiddenFieldsCount = useMemo(() => {
    try {
      let count = 0
      
      const countHidden = (obj: any): void => {
        if (!obj || typeof obj !== 'object') return
        
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'ui:widget' && value === 'hidden') {
            count++
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            countHidden(value)
          }
        }
      }
      
      countHidden(uiSchemaRaw)
      return count
    } catch (error) {
      console.error('Failed to count hidden fields:', error)
      return 0
    }
  }, [])

  // Transform flat ConfigData to nested RJSF format with loading state
  useEffect(() => {
    let mounted = true
    
    const transformData = async () => {
      setIsLoading(true)
      try {
        const transformedData = configDataToRjsf(data, configSchema)
        if (mounted) {
          setFormData(transformedData)
          setErrors([])
          setIsValid(true)
        }
      } catch (error) {
        console.error('Failed to transform data for RJSF:', error)
        if (mounted) {
          setErrors([{ message: 'Failed to load configuration data' }])
          setIsValid(false)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    
    transformData()
    
    return () => {
      mounted = false
    }
  }, [data, configSchema])

  // Handle form changes with debouncing
  const handleChange = useCallback((e: IChangeEvent) => {
    try {
      setFormData(e.formData)
      const flatData = rjsfToConfigData(e.formData)
      onDataChange(flatData)
      setErrors(e.errors || [])
      setIsValid((e.errors?.length || 0) === 0)
    } catch (error) {
      console.error('Failed to handle form change:', error)
      setErrors([{ message: 'Failed to process form changes' }])
    }
  }, [onDataChange])

  // Toggle section expansion
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(section)) {
        newExpanded.delete(section)
      } else {
        newExpanded.add(section)
      }
      return newExpanded
    })
  }, [])

  // Expand all sections
  const expandAll = useCallback(() => {
    setExpandedSections(new Set(topLevelProperties))
  }, [topLevelProperties])

  // Collapse all sections
  const collapseAll = useCallback(() => {
    setExpandedSections(new Set())
  }, [])

  // Custom templates
  const templates = {
    FieldTemplate: SimpleFieldTemplate,
    ObjectFieldTemplate: SimpleObjectFieldTemplate,
    ArrayFieldTemplate: SimpleArrayFieldTemplate,
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="text-muted-foreground">Loading configuration...</div>
      </div>
    )
  }

  // Show schema error if any
  if (schemaError) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{schemaError}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search configuration sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Show Hidden Fields Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-hidden" className="text-base">
                Show Advanced Settings
              </Label>
              <p className="text-sm text-muted-foreground">
                {showHiddenFields 
                  ? `Showing ${hiddenFieldsCount} advanced configuration options`
                  : `${hiddenFieldsCount} advanced options are hidden`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showHiddenFields ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <Switch
                id="show-hidden"
                checked={showHiddenFields}
                onCheckedChange={setShowHiddenFields}
                aria-label="Toggle advanced settings visibility"
              />
            </div>
          </div>

          {/* Quick Section Navigation */}
          {topLevelProperties.length > 0 && (
            <div className="space-y-2">
              <Label>Quick Navigation</Label>
              <div className="flex flex-wrap gap-2">
                {topLevelProperties.map(section => (
                  <Button
                    key={section}
                    variant={expandedSections.has(section) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSection(section)}
                    className="text-xs"
                    aria-label={`Toggle ${section} section`}
                  >
                    {expandedSections.has(section) ? (
                      <ChevronDown className="h-3 w-3 mr-1" />
                    ) : (
                      <ChevronRight className="h-3 w-3 mr-1" />
                    )}
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAll}
                  className="text-xs"
                >
                  Expand All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAll}
                  className="text-xs"
                >
                  Collapse All
                </Button>
              </div>
            </div>
          )}

          {/* No results message */}
          {searchQuery && topLevelProperties.length === 0 && (
            <Alert>
              <AlertDescription>
                No sections found matching "{searchQuery}"
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Validation Status */}
      {!isValid && errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the validation errors before proceeding.
          </AlertDescription>
        </Alert>
      )}
      
      {isValid && formData && Object.keys(formData).length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Configuration is valid and ready for export.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardContent className="pt-6">
          <Form
            schema={configSchema}
            uiSchema={processedUiSchema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            widgets={widgets}
            templates={templates}
            showErrorList={false}
            noHtml5Validate
            liveValidate={false}
            omitExtraData={false}
            experimental_defaultFormStateBehavior={{
              arrayMinItems: { populate: 'never' },
              emptyObjectFields: 'skipDefaults'
            }}
          >
            {/* Hide the default submit button */}
            <div style={{ display: 'none' }} />
          </Form>
        </CardContent>
      </Card>

      {/* Debug Information (only in development) */}
      {process.env.NODE_ENV === 'development' && errors.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <details>
              <summary className="text-sm font-medium cursor-pointer">
                Debug: Validation Details
              </summary>
              <pre className="mt-2 text-xs overflow-auto max-h-64 p-2 bg-muted rounded">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// CRITICAL: Add default export
export default ConfigFormRJSF
